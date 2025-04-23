import db from '../../models/index.js';

const { Model } = db;

export const getOptimizedPrompt = async (req, res) => {
  try {
    // the route has the id in the url model/:id/optimized-prompt
    const model = await Model.findOne({ where: { slug: req.params.id }});
    const optimizedPrompt = await model.prompt();

    res.status(200).json({ optimizedPrompt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};