import db from '../../models/index.js';

const { DatasetGroup, Dataset } = db;
export const createDatasetGroup = async (req, res) => {
  try {
    const datasetGroup = await DatasetGroup.create(req.body);
    res.status(201).json(datasetGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllDatasetGroups = async (req, res) => {
  try {
    const datasetGroups = await DatasetGroup.findAll();
    res.status(200).json(datasetGroups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDatasetGroupById = async (req, res) => {
  try {
    const datasetGroup = await DatasetGroup.findByPk(req.params.id);
    if (!datasetGroup) {
      return res.status(404).json({ error: 'Dataset Group not found' });
    }
    res.status(200).json(datasetGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDatasetGroup = async (req, res) => {
  try {
    const datasetGroup = await DatasetGroup.findByPk(req.params.id);
    if (!datasetGroup) {
      return res.status(404).json({ error: 'Dataset Group not found' });
    }
    await datasetGroup.update(req.body);
    res.status(200).json(datasetGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteDatasetGroup = async (req, res) => {
  try {
    const datasetGroup = await DatasetGroup.findByPk(req.params.id);
    if (!datasetGroup) {
      return res.status(404).json({ error : 'Dataset Group not found' });
    }
    await datasetGroup.destroy();
    res.status(204).json();
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const me = async (req, res) => {
  try {
    const { userObject } = req;
    const { companyId } = userObject;
    const datasetGroups = await DatasetGroup.findAll({
      where: { companyId },
      include: [
        {
          model: Dataset,
          as: 'datasets',
        },
      ],
    });
    res.status(200).json(datasetGroups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
