import db from '../../models/index.js';

const { ModelGroup } = db;

export const createModelGroup = async (req, res) => {
  try {
    const modelGroup = await ModelGroup.create(req.body);
    res.status(201).json(modelGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllModelGroups = async (req, res) => {
  try {
    const modelGroups = await ModelGroup.findAll();
    res.status(200).json(modelGroups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getModelGroupById = async (req, res) => {
  try {
    const modelGroup = await ModelGroup.findByPk(req.params.id);
    if (!modelGroup) {
      return res.status(404).json({ error: 'Model Group not found' });
    }
    res.status(200).json(modelGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateModelGroup = async (req, res) => {
  try {
    const modelGroup = await ModelGroup.findByPk(req.params.id);
    if (!modelGroup) {
      return res.status(404).json({ error: 'Model Group not found' });
    }
    await modelGroup.update(req.body);
    res.status(200).json(modelGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteModelGroup = async (req, res) => {
  try {
    const modelGroup = await ModelGroup.findByPk(req.params.id);
    if (!modelGroup) {
      return res.status(404).json({ error: 'Model Group not found' });
    }
    await modelGroup.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
