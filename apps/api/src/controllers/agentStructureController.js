import { getAgentStructure } from '../services/agentStructureService.js';
import { z } from 'zod';

export const getAgentStructureController = async (req, res) => {
  try {
    const agentId = parseInt(req.params.agentId);
    const structure = await getAgentStructure(agentId);
    res.json(structure);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid agent ID' });
    }
    if (error.message === 'Agent not found') {
      return res.status(404).json({ error: 'Agent not found' });
    }
    console.error('Error getting agent structure:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 