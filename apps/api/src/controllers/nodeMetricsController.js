import { z } from 'zod';
import { getNodeMetrics, getOptimizedNodeMetrics, getNodeInsights } from '../services/nodeMetricsService.js';

const getNodeMetricsSchema = z.object({
  nodeIds: z.array(z.number()),
  startDate: z.string().date(),
  endDate: z.string().date()
});

export const getNodeMetricsController = async (req, res) => {
  try {
    const { nodeIds, startDate, endDate } = getNodeMetricsSchema.parse(req.body);
    
    const metrics = await getNodeMetrics(nodeIds, new Date(startDate), new Date(endDate));
    
    return res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error getting node metrics:', error);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 

export const getOptimizedNodeMetricsController = async (req, res) => {
  try {
    const { nodeIds, startDate, endDate } = getNodeMetricsSchema.parse(req.body);
    
    const metrics = await getOptimizedNodeMetrics(nodeIds, new Date(startDate), new Date(endDate));
    
    return res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error getting node metrics:', error);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}


export const getNodeInsightsController = async (req, res) => {
  try {
    const { nodeIds } = req.body;

    const insights = await getNodeInsights(nodeIds);

    return res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error getting node insights:', error);
  }
}

