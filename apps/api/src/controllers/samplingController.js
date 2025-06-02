import db from '../../models/index.js';
import { sampleNodeData, sampleOptimizedNodeData, sampleAgentEntries } from '../services/samplingService.js';
import { z } from 'zod';

const { ModelLog, AgentNodeLog, AgentNode, Agent, Model, AgentLog } = db;

const samplingRequestSchema = z.object({
  nodeIds: z.array(z.number()),
  fields: z.array(z.string()),
  startDate: z.string().date(),
  endDate: z.string().date(),
  samplePercentage: z.number().min(1).max(100).optional()
});

export const sampleOptimizedModel = async (req, res) => {
  try {
    const validatedData = samplingRequestSchema.parse(req.body);

    const results = await sampleOptimizedNodeData({
      ...validatedData,
      ModelLog,
      AgentNode,
      Model
    });

    res.json(results);
  } catch (error) {
    console.error('Error in sampleOptimizedModel:', error);
  }
}

export const sampleNodes = async (req, res) => {
  try {
    // Validate request body
    const validatedData = samplingRequestSchema.parse(req.body);

    const results = await sampleNodeData({
      ...validatedData,
      ModelLog,
      AgentNodeLog,
      AgentNode,
      Agent
    });

    res.json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Error in sampleNodes:', error);
    res.status(500).json({
      error: error.message
    });
  }
}; 

export const sampleAgentEntriesExecute = async (req, res) => {
  try {
    const { agentId, nodeIds, fields, startDate, endDate, samplePercentage } = req.body;

    const results = await sampleAgentEntries({
      agentId,
      nodeIds,
      fields,
      startDate,
      endDate,
      samplePercentage,
      ModelLog,
      AgentNodeLog,
      AgentNode,
      Model,
      AgentLog
    });

    res.json(results);
  } catch (error) {
    console.error('Error in sampleAgentEntriesExecute:', error);
  }
}

