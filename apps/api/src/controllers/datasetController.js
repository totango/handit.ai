import db from '../../models/index.js';
import { checkSubscriptionLimits } from '../services/membershipService.js';

const { Dataset, Model, DatasetGroup } = db;
export const createDataset = async (req, res) => {
  try {
    const answer = await checkSubscriptionLimits(req.userObject.id, 'datasets');
    if (!answer) {
      return res.status(400).json({ error: 'Subscription limit reached' });
    }
    const { userObject } = req;
    const { companyId } = userObject;
    const datasetGroup = await DatasetGroup.create({
      name: req.body.name,
      description: req.body.datasetCreationDate,
      companyId,
    });
    const dataset = await Dataset.create({
      ...req.body,
      datasetGroupId: datasetGroup.id,
    });
    res.status(201).json(dataset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.findAll();
    res.status(200).json(datasets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDatasetById = async (req, res) => {
  try {
    const dataset = await Dataset.findByPk(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    res.status(200).json(dataset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findByPk(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    await dataset.update(req.body);
    res.status(200).json(dataset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findByPk(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    await dataset.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDatasetsByGroupId = async (req, res) => {
  try {
    const datasets = await Dataset.findAll({
      where: { datasetGroupId: req.params.id },
    });
    res.status(200).json(datasets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDatasetsByModelId = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model.findOne({
      where: { id },
      include: [
        {
          model: Dataset,
          as: 'datasets', // Alias used in the association
        },
      ],
    });
    res.status(200).json(model);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyDatasets = async (req, res) => {
  try {
    const { userObject } = req;
    const { companyId } = userObject;
    const datasetGroups = await DatasetGroup.findAll({ where: { companyId } });
    const datasetGroupIds = datasetGroups.map(
      (datasetGroup) => datasetGroup.id
    );
    const datasets = await Dataset.findAll({
      where: { datasetGroupId: datasetGroupIds },
    });
    res.status(200).json(datasets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
