import db from '../../models/index.js';
import { getCompanyMetricsOfCompany } from '../services/companyMetricService.js';

const { CompanyMetric } = db;
export const createCompanyMetric = async (req, res) => {
  try {
    const { userObject } = req;
    const companyId = userObject.companyId;
    const currentValue = req.body.currentValue;
    const companyMetric = await CompanyMetric.create({...req.body, companyId});
    if (currentValue !== undefined) {
      await companyMetric.createCompanyMetricLog({value: currentValue});
    }
    res.status(201).json(companyMetric);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCompanyMetrics = async (req, res) => {
  try {
    const companyMetrics = await CompanyMetric.findAll();
    res.status(200).json(companyMetrics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCompanyMetricById = async (req, res) => {
  try {
    const companyMetric = await CompanyMetric.findByPk(req.params.id);
    if (!companyMetric) {
      return res.status(404).json({ error: 'Company Metric not found' });
    }
    res.status(200).json(companyMetric);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCompanyMetric = async (req, res) => {
  try {
    const currentValue = req.body.currentValue;
    const companyMetric = await CompanyMetric.findByPk(req.params.id);
    if (!companyMetric) {
      return res.status(404).json({ error: 'Company Metric not found' });
    }
    if (currentValue !== undefined) {
      await companyMetric.createCompanyMetricLog({value: currentValue});
    }
    await companyMetric.update(req.body);
    res.status(200).json(companyMetric);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCompanyMetric = async (req, res) => {
  try {
    const companyMetric = await CompanyMetric.findByPk(req.params.id);
    if (!companyMetric) {
      return res.status(404).json({ error: 'Company Metric not found' });
    }
    await companyMetric.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const me = async (req, res) => {
  const { userObject } = req;
  const companyId = userObject.companyId;

  try {
    const companyMetrics = await getCompanyMetricsOfCompany(companyId);
    res.status(200).json(companyMetrics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}