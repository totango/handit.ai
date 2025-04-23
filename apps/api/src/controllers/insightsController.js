import db from '../../models/index.js';
const { Insights } = db;

export const getInsightsOfModel = async (req, res) => {
  try {
    let insights = await Insights.findAll({
      where: {
        modelId: req.params.modelId
      },
      order: [['createdAt', 'DESC']]
    });
    insights = insights.sort((a, b) => b.id - a.id);
    res.status(200).json(insights);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};