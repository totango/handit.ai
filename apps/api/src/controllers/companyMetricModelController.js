import db from '../../models/index.js';

const { CompanyMetricModel } = db;
export const createCompanyMetricModel = async (req, res) => {
  try {
    const companyMetricModel = await CompanyMetricModel.create(req.body);
    res.status(201).json(companyMetricModel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCompanyMetricModels = async (req, res) => {
  try {
    const companyMetricModels = await CompanyMetricModel.findAll();
    res.status(200).json(companyMetricModels);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCompanyMetricModelById = async (req, res) => {
  try {
    const companyMetricModel = await CompanyMetricModel.findByPk(req.params.id);
    if (!companyMetricModel) {
      return res.status(404).json({ error: 'Company Metric Model not found' });
    }
    res.status(200).json(companyMetricModel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCompanyMetricModel = async (req, res) => {
  try {
    const companyMetricModel = await CompanyMetricModel.findByPk(req.params.id);
    if (!companyMetricModel) {
      return res.status(404).json({ error: 'Company Metric Model not found' });
    }
    await companyMetricModel.update(req.body);
    res.status(200).json(companyMetricModel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCompanyMetricModel = async (req, res) => {
  try {
    const companyMetricModel = await CompanyMetricModel.findByPk(req.params.id);
    if (!companyMetricModel) {
      return res.status(404).json({ error: 'Company Metric Model not found' });
    }
    await companyMetricModel.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}