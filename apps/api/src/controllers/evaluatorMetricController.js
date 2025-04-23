import db from '../../models/index.js';
import { Op } from 'sequelize';

export const createEvaluatorMetric = async (req, res) => {
  try {
    const companyId = req.userObject?.companyId || req.company?.id;
    if (!companyId) return res.status(400).json({ error: 'Missing companyId' });
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    // Prevent duplicate name for the same company
    const exists = await db.EvaluatorMetric.findOne({
      where: {
        name,
        companyId,
      },
    });
    if (exists) return res.status(409).json({ error: 'Metric with this name already exists for this company' });
    const metric = await db.EvaluatorMetric.create({
      name,
      description,
      isGlobal: false,
      companyId,
    });
    res.status(201).json(metric);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEvaluatorMetrics = async (req, res) => {
  try {
    const companyId = req.userObject?.companyId || req.company?.id;
    if (!companyId) return res.status(400).json({ error: 'Missing companyId' });
    // Return global metrics and company-specific metrics
    const metrics = await db.EvaluatorMetric.findAll({
      where: {
        [Op.or]: [
          { isGlobal: true },
          { companyId },
        ],
      },
      order: [['createdAt', 'DESC']],
    });
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 