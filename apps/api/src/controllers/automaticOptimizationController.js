import db from '../../models/index.js';

const { Model } = db;

export const applySuggestionsToModel = async (req, res) => {
  const { modelId } = req.params;
  const model = await Model.findByPk(modelId);

  const newPrompt = await model.applySuggestions();

  res.status(200).json({ prompt: newPrompt });
};

export const useOptimizedPrompt = async (req, res) => {
  const { modelId } = req.params;
  const model = await Model.findByPk(modelId);
  const { newPrompt } = req.body;
  await model.changePrompt(newPrompt);
  res.status(200).json(model);
};
