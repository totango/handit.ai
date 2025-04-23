import { Op } from 'sequelize';
import db from '../../models/index.js';
import { redisService } from '../services/redisService.js';

const { AgentNode, Model, ModelMetric, ModelMetricLog, AgentNodeLog, Insights } = db;

export const getNodeInsights = async (nodeIds) => {
  const nodes = await AgentNode.findAll({
    where: { id: { [Op.in]: nodeIds } }
  });

  const results = await Promise.all(nodes.map(async (node) => {
    if (node.type === 'model') {
      const model = await Model.findByPk(node.modelId);
      const insights = await Insights.findAll({
        where: { modelId: model.id },
        order: [['createdAt', 'DESC']],
        limit: 1,
        attributes: ['modelId', 'problem', 'solution']
      });
      return insights;
    }
    return null;
  }));
  
  const filteredResults = results.filter(result => result !== null);

  return filteredResults;
  
}

export const getOptimizedNodeMetrics = async (nodeIds, startDate, endDate) => {
  const cacheKey = `optimized_node_metrics:${nodeIds.join(',')}:${startDate}:${endDate}`;
  
  // Try to get from cache first
  const cachedData = await redisService.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const nodes = await AgentNode.findAll({
    where: { id: { [Op.in]: nodeIds } }
  });

  const results = await Promise.all(nodes.map(async (node) => {
    if (node.type === 'model') {
      const model = await Model.findByPk(node.modelId);
      const optimizedModel = await model.getPrincipalABTestModel();
      if (optimizedModel) {
        const optimizedModelId = optimizedModel.id;
        const metrics = await getNodeMetrics([optimizedModelId], startDate, endDate);
        return {
          originalModel: model.toJSON(),
          optimizedModel: optimizedModel.toJSON(),
          optimizedModelMetrics: metrics
        };
      }
      return null;
    } else {
      return null;
    }
  }));

  const filteredResults = results.filter(result => result !== null);

  // Cache the results for 1 hour
  await redisService.set(cacheKey, JSON.stringify(filteredResults), 3600);

  return filteredResults;
}


export const getNodeMetrics = async (nodeIds, startDate, endDate) => {
  // Generate cache key
  const cacheKey = `node_metrics:${nodeIds.join(',')}:${startDate}:${endDate}`;
  
  // Try to get from cache first
  const cachedData = await redisService.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Get all nodes
  const nodes = await AgentNode.findAll({
    where: {
      id: { [Op.in]: nodeIds }
    },
    include: [{
      model: Model,
      as: 'Model'
    }]
  });

  const results = await Promise.all(nodes.map(async (node) => {
    let metrics = [];
    
    if (node.type === 'model' && node.Model) {
      // Get model metrics
      const modelMetrics = await ModelMetric.findAll({
        where: { modelId: node.Model.id }
      });

      const modelMetricIds = modelMetrics.map(metric => metric.id);
      const metricLogs = await ModelMetricLog.findAll({
        where: {
          modelMetricId: { [Op.in]: modelMetricIds },
          createdAt: { [Op.between]: [startDate, endDate] }
        },
        order: [['createdAt', 'ASC']]
      });

      metrics = modelMetrics.map(metric => ({
        id: metric.id,
        name: metric.name,
        description: metric.description,
        type: 'model',
        logs: metricLogs
          .filter(log => log.modelMetricId === metric.id)
          .map(log => ({
            value: log.value,
            createdAt: log.createdAt,
            label: log.label
          }))
      }));
    } else {
      // Get tool metrics from AgentNodeLog
      const toolLogs = await AgentNodeLog.findAll({
        where: {
          agentNodeId: node.id,
          createdAt: { [Op.between]: [startDate, endDate] }
        },
        order: [['createdAt', 'ASC']]
      });

      metrics = [{
        id: node.id,
        name: 'tool_metrics',
        description: 'Tool execution metrics',
        type: 'tool',
        logs: toolLogs.map(log => ({
          value: log.status === 'success' ? 1 : 0,
          createdAt: log.createdAt,
          label: log.status
        }))
      }];
    }

    return {
      nodeId: node.id,
      nodeName: node.name,
      type: node.type,
      metrics
    };
  }));

  // Cache the results for 1 hour
  await redisService.set(cacheKey, JSON.stringify(results), 3600);

  return results;
}; 