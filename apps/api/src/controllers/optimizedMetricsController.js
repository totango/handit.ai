// controllers/optimizedMetricsController.js
import db from '../../models/index.js';
import { redisService } from '../services/redisService.js';

// Helper function to get environment from request
const getEnvironment = (req) => req.query.environment || 'production';

// Optimized tool metrics query
const getToolMetricsOptimized = async (agentId) => {
  console.time(`Optimized getToolMetrics for agent ${agentId}`);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  // First, get tool nodes for the agent (should be fast with index)
  const toolNodes = await db.sequelize.query(
    `SELECT id, name FROM "AgentNodes" 
     WHERE agent_id = :agentId AND type = 'tool' AND deleted_at IS NULL`,
    {
      replacements: { agentId },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  if (toolNodes.length === 0) {
    console.timeEnd(`Optimized getToolMetrics for agent ${agentId}`);
    return { metricsByTool: {}, aggregatedMetrics: {} };
  }

  const nodeIds = toolNodes.map(n => n.id);
  
  // Batch query for all tool metrics
  const metrics = await db.sequelize.query(
    `
    SELECT 
      agent_node_id,
      DATE(created_at) as date,
      status,
      COUNT(*) as count
    FROM "AgentNodeLogs"
    WHERE agent_node_id = ANY(:nodeIds)
    AND created_at > :startDate
    GROUP BY agent_node_id, DATE(created_at), status
    ORDER BY date DESC
    `,
    {
      replacements: { nodeIds, startDate: thirtyDaysAgo },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  // Process results in memory
  const metricsByTool = {};
  const aggregatedMetrics = {
    success: 0,
    error: 0,
    totalUsage: 0,
  };

  // Create node map for quick lookup
  const nodeMap = Object.fromEntries(toolNodes.map(n => [n.id, n.name]));

  metrics.forEach(row => {
    const toolName = nodeMap[row.agent_node_id];
    if (!metricsByTool[toolName]) {
      metricsByTool[toolName] = {
        success: 0,
        error: 0,
        totalUsage: 0,
        dailyMetrics: []
      };
    }

    const count = parseInt(row.count);
    if (row.status === 'success') {
      metricsByTool[toolName].success += count;
      aggregatedMetrics.success += count;
    } else {
      metricsByTool[toolName].error += count;
      aggregatedMetrics.error += count;
    }
    
    metricsByTool[toolName].totalUsage += count;
    aggregatedMetrics.totalUsage += count;
  });

  console.timeEnd(`Optimized getToolMetrics for agent ${agentId}`);
  return { metricsByTool, aggregatedMetrics };
};

// Optimized model metrics query
const getModelMetricsOptimized = async (agentId) => {
  console.time(`Optimized getModelMetrics for agent ${agentId}`);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  // Simplified query focusing on recent data
  const metrics = await db.sequelize.query(
    `
    SELECT 
      m.id as model_id,
      m.name as model_name,
      mm.name as metric_name,
      mm.id as metric_id,
      DATE(mml.created_at) as date,
      AVG(mml.value) as avg_value,
      COUNT(mml.value) as count
    FROM "AgentNodes" n
    INNER JOIN "Models" m ON m.id = n.model_id
    INNER JOIN "ModelMetrics" mm ON mm.model_id = m.id
    INNER JOIN "ModelMetricLogs" mml ON mml.model_metric_id = mm.id
    WHERE n.agent_id = :agentId 
      AND n.type = 'model'
      AND mml.created_at > :startDate
      AND mm.name != 'Healtcheck'
    GROUP BY m.id, m.name, mm.name, mm.id, DATE(mml.created_at)
    ORDER BY date DESC
    LIMIT 1000
    `,
    {
      replacements: { agentId, startDate: thirtyDaysAgo },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  // Process results
  const modelMetrics = {};
  const aggregatedMetrics = {};

  metrics.forEach(row => {
    const modelName = row.model_name;
    const metricName = row.metric_name;
    
    if (!modelMetrics[modelName]) {
      modelMetrics[modelName] = {};
    }
    
    if (!modelMetrics[modelName][metricName]) {
      modelMetrics[modelName][metricName] = {
        total: 0,
        count: 0,
        average: 0,
        dailyValues: []
      };
    }

    const avgValue = parseFloat(row.avg_value);
    const count = parseInt(row.count);
    
    modelMetrics[modelName][metricName].total += avgValue * count;
    modelMetrics[modelName][metricName].count += count;
    modelMetrics[modelName][metricName].average = 
      modelMetrics[modelName][metricName].total / modelMetrics[modelName][metricName].count;

    // Aggregate across all models
    if (!aggregatedMetrics[metricName]) {
      aggregatedMetrics[metricName] = {
        total: 0,
        count: 0,
        average: 0
      };
    }
    
    aggregatedMetrics[metricName].total += avgValue * count;
    aggregatedMetrics[metricName].count += count;
    aggregatedMetrics[metricName].average = 
      aggregatedMetrics[metricName].total / aggregatedMetrics[metricName].count;
  });

  console.timeEnd(`Optimized getModelMetrics for agent ${agentId}`);
  return { 
    modelMetrics,
    aggregatedMetrics: Object.entries(aggregatedMetrics).map(([name, data]) => ({
      name,
      value: data.average,
      count: data.count
    }))
  };
};

export const getAgentMetricsOptimized = async (req, res) => {
  try {
    const { userObject } = req;
    const { companyId } = userObject;
    const environment = getEnvironment(req);
    
    // Verify agent access
    const agent = await db.Agent.findOne({
      where: { 
        id: req.params.id,
        companyId,
        deletedAt: null
      }
    });
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const cacheKey = `agent-metrics:${req.params.id}:${environment}`;
    
    // Check cache first
    const cachedMetrics = await redisService.get(cacheKey);
    if (cachedMetrics) {
      console.log(`Cache hit for agent metrics ${req.params.id}`);
      return res.status(200).json(cachedMetrics);
    }
    
    // Compute metrics with timeout protection
    const computeMetrics = async () => {
      // Run both queries in parallel
      const [modelData, toolData] = await Promise.all([
        getModelMetricsOptimized(req.params.id),
        getToolMetricsOptimized(req.params.id)
      ]);
      
      return {
        modelMetrics: modelData,
        toolMetrics: toolData,
      };
    };
    
    // Set a 25-second timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Metric computation timeout')), 25000)
    );
    
    try {
      const metrics = await Promise.race([computeMetrics(), timeoutPromise]);
      
      // Cache for 5 minutes
      await redisService.set(cacheKey, metrics, 300);

      res.status(200).json(metrics);
    } catch (timeoutError) {
      console.error('Optimized metrics timeout for agent:', req.params.id, timeoutError.message);
      
      // Return partial data if available
      res.status(504).json({ 
        error: 'Request timeout - metrics computation taking too long',
        suggestion: 'Try again in a few moments or contact support if the issue persists'
      });
    }
  } catch (error) {
    console.error('Optimized agent metrics error:', error);
    res.status(400).json({ error: error.message });
  }
};

export default {
  getAgentMetricsOptimized
};