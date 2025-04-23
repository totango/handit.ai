import db from '../../models/index.js';

const { Alert, ModelMetric, Model } = db;

export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    if (alert.type === 'error') {
      const modelMetric = await ModelMetric.findByPk(alert.modelMetricId);
      const model = await Model.findByPk(modelMetric.modelId);
      const groupedAlerts = await model.groupedAlerts();
      const errorAlerts = groupedAlerts.errorAlerts;
      const grouped = errorAlerts[alert.data.message]
      return res.status(200).json({ alert, grouped });
    }
    res.status(200).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
