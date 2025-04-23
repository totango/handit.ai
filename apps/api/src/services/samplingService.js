import { parseInputContent, parseOutputContent, parseContext } from './parser.js';
import { redisService } from './redisService.js';
import { Op } from 'sequelize';

const MAX_TOKENS = 300000; // 1M tokens limit
const SAMPLE_SIZE = 10; // Number of recent entries to analyze for estimation

const cleanData = (data) => {
  if (!data) return data;
  
  // If data is an array, clean each item
  if (Array.isArray(data)) {
    return data.map(item => cleanData(item));
  }
  
  // If data is an object, clean each property
  if (typeof data === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip base64 image data and image URLs
      if (typeof value === 'string' && (
        value.startsWith('data:image') || 
        value.startsWith('http') && (value.includes('.jpg') || value.includes('.png') || value.includes('.jpeg'))
      )) {
        continue;
      }
      cleaned[key] = cleanData(value);
    }
    return cleaned;
  }
  
  return data;
};

const estimateTokens = (data) => {
  if (!data) return 0;
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
};

export const sampleOptimizedNodeData = async ({
  nodeIds,
  fields,
  startDate,
  endDate,
  ModelLog,
  AgentNode,
  Model,
}) => {
  const agentNodes = await AgentNode.findAll({
    where: {
      id: { [Op.in]: nodeIds }
    }
  });

  const results = await Promise.all(agentNodes.map(async (agentNode) => {
    if (agentNode.type === 'model') {
      const model = await Model.findByPk(agentNode.modelId);
      const optimizedModel = await model.getPrincipalABTestModel();
      if (optimizedModel) {
        const optimizedModelId = optimizedModel.id;
        const data = await sampleModelData({
          modelId: optimizedModelId,
          fields,
          startDate,
          endDate,
          ModelLog,
          Model
        });
        return {
          originalModel: model.toJSON(),
          optimizedModel: optimizedModel.toJSON(),
          dataOptimizedModel: data
        }
      }
      return null;
    } else {
      return null;
    }
  }));

  return results.filter(result => result !== null);
}

export const sampleModelData = async ({
  modelId,
  fields,
  startDate,
  endDate,
  ModelLog,
  Model,
  samplePercentage = null
}) => {
  const cacheKey = `model_sample:${modelId}:${fields.join(',')}:${startDate}:${endDate}`;
  const cachedData = await redisService.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const model = await Model.findByPk(modelId);

  const modelLogsTotal = await ModelLog.count({
    where: {
      modelId: modelId,
      createdAt: { [Op.between]: [startDate, endDate] }
    }
  });

  const sampleEntries = await ModelLog.findAll({
    where: {
      modelId: modelId,
      createdAt: { [Op.between]: [startDate, endDate] }
    },
    attributes: fields,
      limit: SAMPLE_SIZE,
    order: [['createdAt', 'DESC']]
  });

  const avgTokensPerEntry = sampleEntries.reduce((acc, entry) => {
    const input = entry.input ? parseInputContent(entry.input) : '';
    const output = entry.output ? parseOutputContent(entry.output) : '';
    const actual = entry.actual ? entry.actual : '';
    return acc + (estimateTokens(input) + estimateTokens(output) + estimateTokens(actual));
  }, 0) / Math.max(sampleEntries.length, 1);

  const estimatedTokens = modelLogsTotal * avgTokensPerEntry;
  const needsSampling = estimatedTokens > MAX_TOKENS;

  let actualSamplePercentage = samplePercentage;
  if (needsSampling && !samplePercentage) {
    actualSamplePercentage = Math.min(100, Math.floor((MAX_TOKENS / estimatedTokens) * 100));
  }

  const query = {
    where: {
      modelId: modelId,
      createdAt: { [Op.between]: [startDate, endDate] }
    },
    attributes: fields,
    order: [['createdAt', 'DESC']]
  };

  if (actualSamplePercentage && actualSamplePercentage < 100) {
    query.limit = Math.ceil(modelLogsTotal * (actualSamplePercentage / 100));
  }

  const logs = await ModelLog.findAll(query);

  const result = {
    modelId,
    modelName: model.name,
    modelLogsTotal,
    estimatedTokens,
    needsSampling,
    actualSamplePercentage,
    sampledEntries: logs.length,
    systemPromptLogs: logs.length > 0 && logs[0].input ? parseContext(logs[0].input) : '',
    logs: logs.map(log => ({
      ...log.toJSON(),
      input: parseInputContent(log.input),
      output: parseOutputContent(log.output),
    }))
  };

  await redisService.set(cacheKey, JSON.stringify(result), 3600);

  return result;
}
export const sampleNodeData = async ({
  nodeIds,
  fields,
  startDate,
  endDate,
  samplePercentage = null,
  ModelLog,
  AgentNodeLog,
  AgentNode,
}) => {
  try {
    // Generate cache key based on parameters
    const cacheKey = `node_sample:${nodeIds.join(',')}:${fields.join(',')}:${startDate}:${endDate}:${samplePercentage}`;
    
    // Try to get from cache first
    const cachedData = await redisService.get(cacheKey);
    if (cachedData) {
      //return JSON.parse(cachedData);
    }

    // Get all nodes to determine their types
    const nodes = await AgentNode.findAll({
      where: {
        id: { [Op.in]: nodeIds }
      }
    });

    const agentId = nodes[0].agentId;

    const agentLogsTotal = await AgentNodeLog.count({
      where: {
        agentId: agentId,
        createdAt: { [Op.between]: [startDate, endDate] }
      }
    });

    console.log('agentId', agentId);
    console.log('agentLogsTotal', agentLogsTotal);


    

    if (nodes.length === 0) {
      throw new Error('No nodes found');
    }

    const results = await Promise.all(nodes.map(async (node) => {
      let estimatedEntries;
      let query;

      if (node.type === 'model') {
        // For model nodes, fetch from ModelLog
        estimatedEntries = await ModelLog.count({
          where: {
            modelId: node.modelId,
            createdAt: { [Op.between]: [startDate, endDate] }
          }
        });

        const fullFields = [...fields, 'agent_log_id'];

        // Get sample of recent entries to estimate token size
        const sampleEntries = await ModelLog.findAll({
          where: {
            modelId: node.modelId,
            createdAt: { [Op.between]: [startDate, endDate] }
          },
          attributes: fullFields,
          limit: SAMPLE_SIZE,
          order: [['createdAt', 'DESC']]
        });

        // Calculate average token size from sample
        const avgTokensPerEntry = sampleEntries.reduce((acc, entry) => {
          const input = entry.input ? parseInputContent(entry.input) : '';
          const output = entry.output ? parseOutputContent(entry.output) : '';
          const actual = entry.actual ? entry.actual : '';
          return acc + (estimateTokens(input) + estimateTokens(output) + estimateTokens(actual));
        }, 0) / Math.max(sampleEntries.length, 1);

        const estimatedTokens = estimatedEntries * avgTokensPerEntry;
        const needsSampling = estimatedTokens > MAX_TOKENS;

        // Calculate actual sample percentage if needed
        let actualSamplePercentage = samplePercentage;
        if (needsSampling && !samplePercentage) {
          actualSamplePercentage = Math.min(100, Math.floor((MAX_TOKENS / estimatedTokens) * 100));
        }


        query = {
          where: {
            modelId: node.modelId,
            createdAt: { [Op.between]: [startDate, endDate] }
          },
          attributes: fullFields,
          order: [['createdAt', 'DESC']]
        };

        // Apply sampling if needed
        if (actualSamplePercentage && actualSamplePercentage < 100) {
          query.limit = Math.ceil(estimatedEntries * (actualSamplePercentage / 100));
        }

        const logs = await ModelLog.findAll(query);

        return {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          agentLogsTotal,
          systemPromptLogs: logs.length > 0 && logs[0].input ? parseContext(logs[0].input) : '',
          logs: logs.map(log => ({
            ...log.toJSON(),
            input: parseInputContent(log.input),
            output: parseOutputContent(log.output),
          })),
          metadata: {
            totalEntries: estimatedEntries,
            samplePercentage: actualSamplePercentage,
            sampledEntries: logs.length,
            estimatedTokens,
            needsSampling,
            avgTokensPerEntry
          }
        };
      } else {
        // For tool nodes, fetch from AgentNodeLog
        estimatedEntries = await AgentNodeLog.count({
          where: {
            agentNodeId: node.id,
            createdAt: { [Op.between]: [startDate, endDate] }
          }
        });

        // Get sample of recent entries to estimate token size
        const sampleEntries = await AgentNodeLog.findAll({
          where: {
            agentNodeId: node.id,
            createdAt: { [Op.between]: [startDate, endDate] }
          },
          attributes: ['input', 'output'],
          limit: SAMPLE_SIZE,
          order: [['createdAt', 'DESC']]
        });


        // Calculate average token size from sample
        const avgTokensPerEntry = sampleEntries.reduce((acc, entry) => {
          return acc + (estimateTokens(entry.input) + estimateTokens(entry.output));
        }, 0) / Math.max(sampleEntries.length, 1);


        const estimatedTokens = estimatedEntries * avgTokensPerEntry;
        const needsSampling = estimatedTokens > MAX_TOKENS;

        // Calculate actual sample percentage if needed
        let actualSamplePercentage = samplePercentage;
        if (needsSampling && !samplePercentage) {
          actualSamplePercentage = Math.min(100, Math.floor((MAX_TOKENS / estimatedTokens) * 100));
        }

        const fullFields = [...fields, 'parent_log_id'];
        console.log('fullFields', fullFields);
        query = {
          where: {
            agentNodeId: node.id,
            createdAt: { [Op.between]: [startDate, endDate] }
          },
          attributes: fullFields,
          order: [['createdAt', 'DESC']]
        };

        // Apply sampling if needed
        if (actualSamplePercentage && actualSamplePercentage < 100) {
          query.limit = Math.ceil(estimatedEntries * (actualSamplePercentage / 100));
        }

        const logs = await AgentNodeLog.findAll(query);

        return {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          agentLogsTotal,
          logs: logs.map(log => ({
            ...log.toJSON(),
            input: cleanData(log.input),
            output: cleanData(log.output)
          })),
          metadata: {
            totalEntries: estimatedEntries,
            samplePercentage: actualSamplePercentage,
            sampledEntries: logs.length,
            estimatedTokens,
            needsSampling,
            avgTokensPerEntry
          }
        };
      }
    }));

    const result = {
      nodeLogs: results,
      agentLogsTotal
    }

    // Cache results for 1 hour
    await redisService.set(cacheKey, JSON.stringify(result), 3600);

    return result;
  } catch (error) {
    console.error('Error in sampleNodeData:', error);
    throw error;
  }
};

export const sampleAgentEntries = async ({
  agentId,
  nodeIds,
  fields,
  startDate,
  endDate,
  samplePercentage = null,
  ModelLog,
  AgentNodeLog,
  AgentNode,
  Model,
  AgentLog,
}) => {
  try {
    // Check cache first
    const cacheKey = `agent-entries:${agentId}:${nodeIds.join(',')}:${startDate}:${endDate}:${samplePercentage}`;
    const cachedData = await redisService.get(cacheKey);
    if (cachedData) {
     return JSON.parse(cachedData);
    }

    // Get all nodes for the agent with their models in a single query
    const nodes = await AgentNode.findAll({
      where: {
        agentId,
        id: { [Op.in]: nodeIds }
      },
      include: [{
        model: Model,
        as: 'Model',
        attributes: ['id', 'name', 'slug']
      }]
    });

    if (!nodes.length) {
      throw new Error('No nodes found for the specified agent');
    }

    // Get all agent logs within date range in a single query
    const agentLogs = await AgentLog.findAll({
      where: {
        agentId,
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: ['id', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    const totalAgentLogs = agentLogs.length;
    const agentLogIds = agentLogs.map(log => log.id);

    // Get all model logs in a single query
    const modelLogs = await ModelLog.findAll({
      where: {
        agentLogId: { [Op.in]: agentLogIds },
        modelId: { [Op.in]: nodes.filter(n => n.type === 'model').map(n => n.modelId) },
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: [...fields, 'agentLogId', 'modelId'],
      order: [['createdAt', 'DESC']]
    });

    // Get all tool logs in a single query
    const toolLogs = await AgentNodeLog.findAll({
      where: {
        parentLogId: { [Op.in]: agentLogIds },
        agentNodeId: { [Op.in]: nodes.filter(n => n.type === 'tool').map(n => n.id) },
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: [...fields.filter(field => field !== 'actual'), 'parentLogId', 'agentNodeId'],
      order: [['createdAt', 'DESC']]
    });

    // Group logs by agentLogId for faster lookup
    const modelLogsByAgentLogId = modelLogs.reduce((acc, log) => {
      if (!acc[log.agentLogId]) acc[log.agentLogId] = [];
      acc[log.agentLogId].push(log);
      return acc;
    }, {});

    const toolLogsByAgentLogId = toolLogs.reduce((acc, log) => {
      if (!acc[log.parentLogId]) acc[log.parentLogId] = [];
      acc[log.parentLogId].push(log);
      return acc;
    }, {});

    // Filter agent logs to only those that have entries for all specified nodes
    const validAgentLogs = agentLogs.filter(agentLog => {
      const hasAllNodes = nodes.every(node => {
        if (node.type === 'model') {
          return modelLogsByAgentLogId[agentLog.id]?.some(log => log.modelId === node.modelId);
        } else {
          return toolLogsByAgentLogId[agentLog.id]?.some(log => log.agentNodeId === node.id);
        }
      });
      return hasAllNodes;
    });

    const totalLogsWithAllNodes = validAgentLogs.length;

    // Calculate tokens and sampling for valid logs
    let totalTokens = 0;
    let sampleCount = Math.min(SAMPLE_SIZE, totalLogsWithAllNodes);
    
    // Get sample logs for token calculation
    const sampleLogIds = validAgentLogs.slice(0, sampleCount).map(log => log.id);
    
    // Calculate tokens for the sample
    for (const agentLogId of sampleLogIds) {
      let runTokens = 0;

      // Process model logs
      const modelEntries = modelLogsByAgentLogId[agentLogId] || [];
      for (const entry of modelEntries) {
        runTokens += estimateTokens(parseInputContent(entry.input)) + 
                    estimateTokens(parseOutputContent(entry.output)) + 
                    estimateTokens(entry.actual);
      }

      // Process tool logs
      const toolEntries = toolLogsByAgentLogId[agentLogId] || [];
      for (const entry of toolEntries) {
        runTokens += estimateTokens(parseInputContent(entry.input)) + 
                    estimateTokens(parseOutputContent(entry.output));
      }

      totalTokens += runTokens;
    }

    const MAX_TOKENS_AGENT = 50000;
    const avgTokensPerRun = totalTokens / sampleCount;
    const estimatedTotalTokens = avgTokensPerRun * totalLogsWithAllNodes;
    const needsSampling = estimatedTotalTokens > MAX_TOKENS_AGENT;

    // Calculate sample percentage if not provided
    if (!samplePercentage) {
      samplePercentage = needsSampling ? Math.min(100, Math.floor((MAX_TOKENS_AGENT / estimatedTotalTokens) * 100)) : 100;
    }

    // Sample the valid logs
    const sampledLogs = validAgentLogs.slice(0, Math.ceil((totalLogsWithAllNodes * samplePercentage) / 100));

    // Process entries for each sampled log
    const results = sampledLogs.map(agentLog => {
      const nodeEntries = nodes.map(node => {
        let entries;
        if (node.type === 'model') {
          entries = (modelLogsByAgentLogId[agentLog.id] || []).filter(log => log.modelId === node.modelId);
        } else {
          entries = (toolLogsByAgentLogId[agentLog.id] || []).filter(log => log.agentNodeId === node.id);
        }

        return {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          entries: entries.map(entry => ({
            ...entry.dataValues,
            inputContent: parseInputContent(entry.input),
            outputContent: parseOutputContent(entry.output)
          }))
        };
      });

      return {
        agentLogId: agentLog.id,
        createdAt: agentLog.createdAt,
        nodes: nodeEntries
      };
    });

    const result = {
      agentLogs: results,
      metadata: {
        totalAgentLogs,
        totalLogsWithAllNodes,
        sampledLogs: results.length,
        samplePercentage,
        needsSampling,
        avgTokensPerRun,
        estimatedTotalTokens
      }
    };

    // Cache results for 1 hour
    await redisService.set(cacheKey, JSON.stringify(result), 3600);

    return result;
  } catch (error) {
    console.error('Error in sampleAgentEntries:', error);
    throw error;
  }
}; 