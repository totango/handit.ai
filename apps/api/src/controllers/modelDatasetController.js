import db from '../../models/index.js';

const { ModelDataset } = db;

export const createModelDataset = async (req, res) => {
  try {
    const modelDataset = await ModelDataset.create(req.body);
    res.status(201).json(modelDataset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllModelDatasets = async (req, res) => {
  try {
    const modelDatasets = await ModelDataset.findAll();
    res.status(200).json(modelDatasets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getModelDatasetById = async (req, res) => {
  try {
    const modelDataset = await ModelDataset.findByPk(req.params.id);
    if (!modelDataset) {
      return res.status(404).json({ error: 'Model Dataset not found' });
    }
    res.status(200).json(modelDataset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateModelDataset = async (req, res) => {
  try {
    const modelDataset = await ModelDataset.findByPk(req.params.id);
    if (!modelDataset) {
      return res.status(404).json({ error: 'Model Dataset not found' });
    }
    await modelDataset.update(req.body);
    res.status(200).json(modelDataset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteModelDataset = async (req, res) => {
  try {
    const modelDataset = await ModelDataset.findByPk(req.params.id);
    if (!modelDataset) {
      return res.status(404).json({ error: 'Model Dataset not found' });
    }
    await modelDataset.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
 
