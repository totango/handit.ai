import { checkSubscriptionLimits } from "../services/membershipService.js";
import { getBasicMetricOfModels, getDetailedMetricOfModel, getListOfEntries, getEntry } from "../services/monitoringService.js";

export const me = async (req, res) => {
  try {
    const { userObject } = req;
    const companyId = userObject.companyId;
    const models = await getBasicMetricOfModels(companyId);
    res.status(201).json(models);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const detailByModelId = async (req, res) => {
  try {
    const modelId = req.params.id;
    const models = await getDetailedMetricOfModel(modelId);
    res.status(201).json(models);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const listMyEntries = async (req, res) => {
  try {
    const modelId = req.params.id;
    const { page, pageSize, type, environment } = req.query;
    if (!modelId) {
      return [];
    }
    const { userObject } = req;
    const companyId = userObject.companyId;

    const models = await getListOfEntries(companyId, modelId, page, pageSize, type, environment);
    res.status(201).json(models);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const detailEntry = async (req, res) => {
  try {
    const entryId = req.params.id;
    const entry = await getEntry(entryId);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const updateEntry = async (req, res) => {
  try {
    const permittedSubscription = await checkSubscriptionLimits(req.userObject.id, 'entries');
    if (!permittedSubscription) {
      return res.status(400).json({ error: 'Subscription limit reached' });
    }
    const entryId = req.params.id;
    const entry = await getEntry(entryId);

    const updatedEntry = await entry.update(req.body);
    res.status(201).json(updatedEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}