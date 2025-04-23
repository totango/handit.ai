import db from '../../models/index.js';
import { executeTrack, executeToolTrack } from '../services/trackService.js';
import { Op } from 'sequelize';

const {
  Model,
  ModelGroup,
  ModelLog,
  AgentLog,
  AgentNodeLog,
  Company,
  AgentNode,
} = db;

export const urlsToTrack = async (req, res) => {
  try {
    const company = req.company;
    const modelGroups = await ModelGroup.findAll({
      where: { companyId: company.id },
    });
    const modelGroupIds = modelGroups.map((modelGroup) => modelGroup.id);
    const models = await Model.findAll({
      where: { modelGroupId: modelGroupIds },
    });

    res.status(201).json(models);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const track = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    console.log('token', token);
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Validate token and get environment
    const companyAuth = await Company.validateApiToken(token);
    if (!companyAuth) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const { environment } = companyAuth;

    // Split the modelId by '-' and get the actual modelId (second part)
    const split = req.body.modelId.split('-');

    const modelId = split[split.length - 1];
    if (!modelId) {
      return res.status(201).json({
        error: 'Invalid modelId format. Expected format: agentId-modelId',
      });
    }

    // First try to find the model directly
    let model = await Model.findOne({ where: { slug: modelId } });

    // If not found, try with the full modelId
    if (!model) {
      model = await Model.findOne({ where: { slug: req.body.modelId } });
    }

    // If still not found, try to find an AgentNode
    let agentNode = null;
    if (!model) {
      agentNode = await db.AgentNode.findOne({
        where: {
          [db.Sequelize.Op.or]: [{ slug: modelId }, { slug: req.body.modelId }],
          type: 'tool',
        },
      });

      if (!agentNode) {
        return res.status(201).json({ error: 'Model or tool node not found' });
      }
    }

    // Add environment to request body
    const trackData = {
      ...req.body,
      environment,
    };
    // Execute appropriate tracking based on whether it's a tool node or not
    const answer = agentNode
      ? await executeToolTrack(agentNode, trackData)
      : await executeTrack(model, trackData, ModelLog);

    if (answer.error) {
      console.log('Error in track:', answer.error);
      return res.status(201).json({ error: answer.error });
    }
    res.status(201).json(answer);
  } catch (error) {
    console.log('Error in track:', error);
    res.status(201).json({ error: error.message });
  }
};

export const endTrack = async (req, res) => {
  try {
    const { error, stack, externalId } = req.body;
    let { agentLogId } = req.body;
    if (!agentLogId && !externalId) {
      return res
        .status(400)
        .json({ error: 'agentLogId or externalId is required' });
    }

    // Start transaction

    // Find the agent log
    let agentLog = null;
    if (agentLogId) {
      agentLog = await AgentLog.findByPk(agentLogId);
    }
    if (!agentLog && externalId) {
      agentLog = await AgentLog.findOne({
        where: { externalId },
      });
    }
    agentLogId = agentLog.id;

    if (!agentLog) {
      return res.status(404).json({ error: 'Agent log not found' });
    }

    const agentNodes = await AgentNode.findAll({
      where: {
        agentId: agentLog.agentId,
        deletedAt: null,
      },
    });
    const modelIds = agentNodes
      .map((node) => node.modelId)
      .filter((id) => id !== null);
    const nodeIds = agentNodes
      .map((node) => node.id)
      .filter((id) => id !== null);

    // Get the latest output from either ModelLog or AgentNodeLog
    const [lastModelLog, lastAgentNodeLog] = await Promise.all([
      ModelLog.findOne({
        where: { agentLogId, modelId: { [Op.in]: modelIds } },
        order: [['createdAt', 'DESC']],
      }),
      AgentNodeLog.findOne({
        where: { parentLogId: agentLogId, agentNodeId: { [Op.in]: nodeIds } },
        order: [['createdAt', 'DESC']],
      }),
    ]);

    // Determine the final output from the most recent log
    let finalOutput = null;
    if (lastModelLog && lastAgentNodeLog) {
      finalOutput =
        lastModelLog.createdAt > lastAgentNodeLog.createdAt
          ? lastModelLog.output
          : lastAgentNodeLog.output;
    } else {
      finalOutput = lastModelLog?.output || lastAgentNodeLog?.output;
    }

    // Calculate duration from start time in metadata
    const endTime = new Date();
    const startTime = new Date(
      agentLog.metadata?.startedAt || agentLog.createdAt
    );
    const duration = endTime.getTime() - startTime.getTime();

    const nodeLogs = await AgentNodeLog.findAll({
      where: { parentLogId: agentLogId, agentNodeId: { [Op.in]: nodeIds } },
      order: [['createdAt', 'DESC']],
    });

    const modelLogs = await ModelLog.findAll({
      where: { agentLogId, modelId: { [Op.in]: modelIds } },
      order: [['createdAt', 'DESC']],
      attributes: ['status'],
    });

    let modelIncorrect = modelLogs.filter(
      (log) =>
        log?.status === 'failed' ||
        log?.dataValues?.status === 'failed' ||
        log?.status === 'error' ||
        log?.dataValues?.status === 'error' ||
        log?.status === 'crash' ||
        log?.dataValues?.status === 'crash'
    ).length;

    let incorrect = nodeLogs.filter(
      (log) =>
        log?.status === 'failed' ||
        log?.dataValues?.status === 'failed' ||
        log?.status === 'error' ||
        log?.dataValues?.status === 'error'
    ).length;

    // Update the agent log
    await agentLog.update({
      status:
        incorrect > 0 || error
          ? 'failed'
          : modelIncorrect > 0
          ? 'failed_model'
          : 'success',
      output: finalOutput,
      duration,
      errorDetails: error ? { message: error, stack } : null,
      metadata: {
        ...agentLog.metadata,
        endedAt: endTime,
      },
    });

    return res.status(200).json({
      id: agentLog.id,
      status: 'success',
      output: finalOutput,
      duration,
    });
  } catch (error) {
    console.error('Error in endTrack:', error);
    return res.status(500).json({ error: error.message });
  }
};
