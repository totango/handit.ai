import db from '../../models/index.js';
import { generateSlug } from '../utils/slugGenerator.js';
import { repositionGraphNodes } from './agentConfigParser.js';
import { Op } from 'sequelize';

const {
  AgentNode,
  AgentConnection,
  AgentLog,
  ModelLog,
  Model,
  AgentNodeLog,
  ModelGroup,
} = db;

/**
 * Creates a new node in an agent, either a model node or a tool node
 */
export const createAgentNode = async ({
  agent,
  nodeType = 'model',
  nodeId,
  nodeName,
  toolType = 'HTTP',
  description = '',
}) => {
  if (nodeType === 'model') {
    const modelGroup = await ModelGroup.create({
      name: nodeName,
      description: description,
      companyId: agent.companyId,
    });
    const model = await Model.create({
      name: nodeName,
      description: description,
      provider: 'openai',
      problemType: 'text_generation',
      parameters: {},
      slug: generateSlug(nodeName),
      modelGroupId: modelGroup.id,
      active: true,
    });

    return await AgentNode.create({
      agentId: agent.id,
      name: model.name,
      type: 'model',
      config: {
        position: { x: 0, y: 0 },
        description:
          model.description ||
          description ||
          'Automatically created model node',
      },
      modelId: model.id,
      slug: nodeId,
    });
  } else {
    return await AgentNode.create({
      agentId: agent.id,
      name: nodeName || nodeId,
      type: 'tool',
      config: {
        position: { x: 0, y: 0 },
        description: description || 'Automatically created tool node',
        toolType,
      },
      slug: nodeId,
    });
  }
};

/**
 * Finds the last node in an agent log execution
 */
export const findLastNodeInExecution = async (agentLogId, agentId) => {
  if (!agentLogId) return null;

  const agentLog = await AgentLog.findByPk(agentLogId);
  if (!agentLog) return null;

  // Try to find the last node log
  const lastNodeLog = await AgentNodeLog.findOne({
    where: { parentLogId: agentLogId },
    order: [['createdAt', 'DESC']],
  });

  // If no node log, try to find the last model log
  const lastModelLog = await ModelLog.findOne({
    where: { agentLogId },
    order: [['createdAt', 'DESC']],
  });
  let lastNodeId = null;
  if (!lastNodeLog && lastModelLog) {
    const lastModelNode = await AgentNode.findOne({
      where: { modelId: lastModelLog.modelId, agentId },
    });
    lastNodeId = lastModelNode?.id || null;
  }

  if (lastNodeLog && !lastModelLog) {
    lastNodeId = lastNodeLog.agentNodeId;
  }

  if (lastNodeLog && lastModelLog) {
    if (lastNodeLog.createdAt > lastModelLog.createdAt) {
      lastNodeId = lastNodeLog.agentNodeId;
    } else {
      const lastModelNode = await AgentNode.findOne({
        where: { modelId: lastModelLog.modelId, agentId },
      });
      lastNodeId = lastModelNode?.id || null;
    }
  }

  return lastNodeId;
};

/**
 * Creates a connection between two nodes
 */
export const connectNodes = async ({
  agentId,
  fromNodeId,
  toNodeId,
  inputName = 'input',
  outputName = 'output',
}) => {
  const connection = await AgentConnection.findOne({
    where: {
      agentId,
      fromNodeId,
      toNodeId,
    },
  });
  if (connection) {
    return connection;
  }
  return await AgentConnection.create({
    agentId,
    fromNodeId,
    toNodeId,
    inputName,
    outputName,
  });
};

/**
 * Updates the positions of all nodes in an agent using the repositionGraphNodes function
 */
export const repositionAgentNodes = async (agent) => {
  const nodes = await AgentNode.findAll({
    where: { agentId: agent.id },
    include: [
      {
        model: AgentConnection,
        as: 'outgoingConnections',
        include: [
          {
            model: AgentNode,
            as: 'toNode',
          },
        ],
      },
    ],
  });

  const agentConfig = {
    agent: {
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
    },
    nodes: nodes.map((node) => ({
      name: node.name,
      slug: node.slug,
      type: node.type,
      description: node.config?.description || '',
      position: node.config?.position || { x: 0, y: 0 },
      next_nodes: node.outgoingConnections.map((conn) => ({
        slug: conn.toNode.slug,
        input_name: conn.inputName,
        output_name: conn.outputName,
      })),
    })),
  };

  const repositionedConfig = repositionGraphNodes(agentConfig);

  // Update node positions
  await Promise.all(
    repositionedConfig.nodes.map(async (nodeConfig) => {
      const node = nodes.find((n) => n.slug === nodeConfig.slug);
      if (node) {
        await node.update({
          config: {
            ...node.config,
            position: nodeConfig.position,
          },
        });
      }
    })
  );
};

/**
 * Finds or creates a node in an agent
 */
export const findOrCreateAgentNode = async ({
  agent,
  nodeType = 'model',
  model = null,
  nodeId,
  nodeName,
  toolType = 'HTTP',
  description = '',
  agentLogId = null,
}) => {
  // Try to find existing node
  const agentLog = await AgentLog.findOne({
    where: {
      agentId: agent.id,
      status: 'processing',
    },
    order: [['createdAt', 'DESC']],
  });
  if (!agentLogId) {
    agentLogId = agentLog?.id;
  }
  let agentNode = await AgentNode.findOne({
    where: {
      [Op.or]: [{ slug: nodeId }, { slug: nodeName }],
      agentId: agent.id,
    },
  });

  if (!agentNode) {
    // Create new node
    agentNode = await createAgentNode({
      agent,
      nodeType,
      nodeId,
      nodeName,
      toolType,
      description,
    });

    // Reposition all nodes
    await repositionAgentNodes(agent);
  }

  // Find last node and create connection if agentLogId is provided
  const lastNodeId = await findLastNodeInExecution(agentLogId, agent.id);
  if (lastNodeId) {
    await connectNodes({
      agentId: agent.id,
      fromNodeId: lastNodeId,
      toNodeId: agentNode.id,
    });
  }
  return agentNode;
};
