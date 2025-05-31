import db from '../../models/index.js';
import { createDefaultEvaluationPrompts } from '../services/evaluationPromptService.js';

const { Company } = db;

export const createCompanyToken = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Company ID is required' });
    }

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    company.apiToken = Company.generateApiToken();
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
export const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    
    // Create default evaluation prompts for the new company
    try {
      await createDefaultEvaluationPrompts(company.id);
      console.log(`Created default evaluation prompts for new company: ${company.id}`);
    } catch (error) {
      console.error('Failed to create default evaluation prompts:', error);
      // Don't fail the company creation if evaluation prompts fail
    }
    
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json(companies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    await company.update(req.body);
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    await company.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
