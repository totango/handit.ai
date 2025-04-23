import db from '../../models/index.js';
export const getAgentStructure = async (agentId) => {
  const { Agent, AgentNode, AgentConnection, Model, AgentLog } = db;

  // Get the agent with its basic info
  const agent = await Agent.findByPk(agentId, {
    attributes: ['id', 'name', 'description', 'slug']
  });

  if (!agent) {
    throw new Error('Agent not found');
  }

  // Get all nodes for this agent
  const nodes = await AgentNode.findAll({
    where: { agentId },
    attributes: ['id', 'name', 'type', 'modelId', 'slug', 'initialNode', 'endNode'],
    include: [
      {
        model: Model,
        as: 'Model',
        attributes: ['id', 'name', 'description']
      }
    ]
  });

  // Get all connections for this agent
  const connections = await AgentConnection.findAll({
    where: { agentId },
    attributes: ['id', 'fromNodeId', 'toNodeId', 'outputName', 'inputName']
  });

  // Build the node structure with connections
  const nodeStructure = nodes.map(node => {
    const nodeData = {
      id: node.id,
      name: node.name,
      type: node.type,
      slug: node.slug,
      isInitial: node.initialNode,
      isEnd: node.endNode,
      incomingConnections: [],
      outgoingConnections: []
    };

    // Add model info if it's a model node
    if (node.type === 'model' && node.Model) {
      nodeData.model = {
        id: node.Model.id,
        name: node.Model.name,
        description: node.Model.description
      };
    }

    // Add incoming connections
    const incoming = connections.filter(conn => conn.toNodeId === node.id);
    nodeData.incomingConnections = incoming.map(conn => ({
      fromNodeId: conn.fromNodeId,
      outputName: conn.outputName,
      inputName: conn.inputName,
      nodeName: nodes.find(n => n.id === conn.fromNodeId).name
    }));

    // Add outgoing connections
    const outgoing = connections.filter(conn => conn.fromNodeId === node.id);
    nodeData.outgoingConnections = outgoing.map(conn => ({
      toNodeId: conn.toNodeId,
      outputName: conn.outputName,
      inputName: conn.inputName,
      nodeName: nodes.find(n => n.id === conn.toNodeId).name
    }));

    return nodeData;
  });

  const lastDateOfAgentLog = await AgentLog.findOne({
    where: { agentId, environment: 'production' },
    order: [['createdAt', 'DESC']],
  });

  console.log(lastDateOfAgentLog);

  return {
    id: agent.id,
    name: agent.name,
    description: agent.description,
    slug: agent.slug,
    nodes: nodeStructure,
    lastDateOfAgentLog: lastDateOfAgentLog.dataValues.createdAt
  };
}; 