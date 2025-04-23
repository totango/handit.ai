import db from '../../models/index.js';

const { ModelLog, ModelGroup, Model } = db;
import { QueryTypes } from 'sequelize';
const { sequelize } = db;

export const createModelLog = async (req, res) => {
  try {
    const isGpt = "choices" in Object.keys(req.body.output)
    const data = req.body;
    if (isGpt) {
      const output = [
        req.body.output.choices[0].content === "Yes" ? 1 : 0,
      ]
      data.predicted = output;
    }
    
    const modelLog = await ModelLog.create(data);
    res.status(201).json(modelLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRandomModelLogAssociatedToModel = async (req, res) => {
  try {
    const log = await sequelize.query(
      `SELECT optimized.* FROM "ModelLogs" AS optimized INNER JOIN "ModelLogs" AS original 
        ON optimized.original_log_id = original.id
        WHERE original.model_id = ${req.params.id}
        ORDER BY RANDOM()
        LIMIT 1`, {
          type: QueryTypes.SELECT,
        }
      );

    if (log.length === 0) {
      return res.status(200).json({});
    }

    const originalLog = await ModelLog.findByPk(log[0].original_log_id);
    

    res.status(200).json({
      optimized: log[0],
      original: originalLog,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getMineModelLogs = async (req, res) => {
  const user = req.userObject;
  const companyId = user.companyId;
  const modelGroups = await ModelGroup.findAll({ where: { companyId: companyId } });
  const modelGroupIds = modelGroups.map((modelGroup) => modelGroup.id);
  const models = await Model.findAll({ where: { modelGroupId: modelGroupIds } });
  const modelIds = models.map((model) => model.id);
  try {
    const modelLogs = await ModelLog.findAll({ where: { modelId: modelIds }, limit: 1000 });
    res.status(200).json(modelLogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const countMineModelLogs = async (req, res) => {
  const user = req.userObject;
  const companyId = user.companyId;
  const modelGroups = await ModelGroup.findAll({ where: { companyId: companyId } });
  const modelGroupIds = modelGroups.map((modelGroup) => modelGroup.id);
  const models = await Model.findAll({ where: { modelGroupId: modelGroupIds } });
  const modelIds = models.map((model) => model.id);
  try {
    const count = await ModelLog.count({ where: { modelId: modelIds } });
    res.status(200).json({ count });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getAllModelLogs = async (req, res) => {
  try {
    const modelLogs = await ModelLog.findAll();
    res.status(200).json(modelLogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getModelLogById = async (req, res) => {
  try {
    const modelLog = await ModelLog.findByPk(req.params.id);
    if (!modelLog) {
      return res.status(404).json({ error: 'Model Log not found' });
    }
    res.status(200).json(modelLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateModelLog = async (req, res) => {
  try {
    const modelLog = await ModelLog.findByPk(req.params.id);
    if (!modelLog) {
      return res.status(404).json({ error: 'Model Log not found' });
    }
    await modelLog.update(req.body);
    res.status(200).json(modelLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteModelLog = async (req, res) => {
  try {
    const modelLog = await ModelLog.findByPk(req.params.id);
    if (!modelLog) {
      return res.status(404).json({ error: 'Model Log not found' });
    }
    await modelLog.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
