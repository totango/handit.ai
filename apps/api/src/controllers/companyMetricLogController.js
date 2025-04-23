import db from '../../models/index.js';

const { CompanyMetricLog } = db;
export const createCompanyMetricLog = async (req, res) => {
  try {
    const companyMetricLog = await CompanyMetricLog.create(req.body);
    res.status(201).json(companyMetricLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCompanyMetricLogs = async (req, res) => {
  try {
    const companyMetricLogs = await CompanyMetricLog.findAll();
    res.status(200).json(companyMetricLogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCompanyMetricLogById = async (req, res) => {
  try {
    const companyMetricLog = await CompanyMetricLog.findByPk(req.params.id);
    if (!companyMetricLog) {
      return res.status(404).json({ error: 'Company Metric Log not found' });
    }
    res.status(200).json(companyMetricLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCompanyMetricLog = async (req, res) => {
  try {
    const companyMetricLog = await CompanyMetricLog.findByPk(req.params.id);
    if (!companyMetricLog) {
      return res.status(404).json({ error: 'Company Metric Log not found' });
    }
    await companyMetricLog.update(req.body);
    res.status(200).json(companyMetricLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCompanyMetricLog = async (req, res) => {
  try {
    const companyMetricLog = await CompanyMetricLog.findByPk(req.params.id);
    if (!companyMetricLog) {
      return res.status(404).json({ error: 'Company Metric Log not found' });
    }
    await companyMetricLog.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
