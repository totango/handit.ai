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
  Agent,
} = db;

export const bulkTrack = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const agentSlug = req.body.agentName;

    // Validate token and get environment
    const companyAuth = await Company.validateApiToken(token);
    if (!companyAuth) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const { environment, company } = companyAuth;

    const companyId = company.id || company.dataValues.id;
    let agents = await Agent.findAll({ where: { companyId } });
    if (agentSlug) {
      // camelize the agentSlug
      const camelizedAgentSlug = camelize(agentSlug);
      agents = agents.filter(agent => agent.slug === agentSlug || agent.slug === camelizedAgentSlug);
    }
    const agentNodes = await AgentNode.findAll({ where: { agentId: { [Op.in]: agents.map(agent => agent.id) } } });
    const availableModels = agentNodes.map(node => node.modelId);
    // Only process workflowData
    if (!req.body.workflowData || !Array.isArray(req.body.workflowData)) {
      return res.status(400).json({ error: 'Request body must have workflowData as an array' });
    }
    const items = req.body.workflowData;
    const openaiToken = req.body.openAI?.token;
    const evaluationModel = req.body.openAI?.model;

    let agentLogId = null;
    // Process each item sequentially to preserve order
    const results = [];
    for (let itemIdx = 0; itemIdx < items.length; itemIdx++) {
      const item = items[itemIdx];
      try {
        // Use item.id as the node slug
        const nodeName = item.slug;
        let modelId = item.input?.params?.modelId || nodeName;
        const slug = nodeName;
        const camelCaseSlug = camelize(slug);
        const lowerCaseSlug = slug.toLowerCase();

        let model = await Model.findOne({ where: { slug, id: { [Op.in]: availableModels } } });
        if (!model) {
          model = await Model.findOne({ where: { slug: modelId, id: { [Op.in]: availableModels } } });
        }
        if (!model) {
          model = await Model.findOne({ where: { slug: camelCaseSlug, id: { [Op.in]: availableModels } } });
        }
        if (!model) {
          model = await Model.findOne({ where: { slug: lowerCaseSlug, id: { [Op.in]: availableModels } } });
        }
        let agentNode = null;
        if (!model) {
          agentNode = await db.AgentNode.findOne({
            where: {
              [db.Sequelize.Op.or]: [{ slug }, { slug: modelId }],
              type: 'tool',
              id: { [Op.in]: agentNodes.map(node => node.id) }
            },
          });
          if (!agentNode) {
            agentNode = await db.AgentNode.findOne({
              where: {
                [db.Sequelize.Op.or]: [
                  { slug: camelCaseSlug },
                  { slug: modelId },
                  { slug: slug },
                  { slug: lowerCaseSlug },
                ],
                type: 'tool',
                id: { [Op.in]: agentNodes.map(node => node.id) }
              },
            });
          }
        }
        // Compose track data
        const trackData = {
          ...item,
          environment,
          evaluationToken: openaiToken,
          evaluationModel,
          nodeName,
          agentLogId,
          slug: null,
        };
        // Save using the same logic as track
        const answer = agentNode
          ? await executeToolTrack(agentNode, trackData)
          : await executeTrack(model, trackData, ModelLog);
        agentLogId = answer.agentLogId;
        if (answer.error) {
          results.push({ node: nodeName, error: answer.error });
        } else {
          results.push({ node: nodeName, success: true, modelLogId: answer.modelLogId || null });
        }
      } catch (err) {
        console.log('err', err);
        results.push({ node: item.id, error: err.message });
      }
    }

    const agentLog = await AgentLog.findByPk(agentLogId);
    if (agentLog) {
     await agentLog.update({
      status: 'success',
      output: results,
     });
    }
    res.status(201).json({ results });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
};

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
