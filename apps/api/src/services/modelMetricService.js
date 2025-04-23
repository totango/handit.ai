import { Op } from 'sequelize';
import db from '../../models/index.js';
import { parseInput } from './parseInput.js';

const { ModelMetric, ModelMetricLog, ModelGroup, Model } = db;

export const getModelEntriesCountByClass = async (modelId) => {
  const model = await Model.findByPk(modelId);
  return await model.getEntriesCountByClass();
};

export const getModelDifferenceLastWeekByClass = async (modelId) => {
  const model = await Model.findByPk(modelId);
  return await model.getDifferenceLastWeekByClass();
};

export const getModelComparisonMetricsLastMonth = async (modelId) => {
  const model = await Model.findByPk(modelId);
  return await model.getComparisonMetricsLastMonth();
};

export const getModelMetricsOfCompany = async (companyId) => {
  const modelGroups = await ModelGroup.findAll({
    where: { companyId },
  });

  const models = await Model.findAll({
    where: { modelGroupId: modelGroups.map((modelGroup) => modelGroup.id) },
  });

  const modelDataPromises = models.map(async (model) => {
    const modelId = model.id;
    const modelMetrics = await ModelMetric.findAll({ where: { modelId } });
    const modelMetricIds = modelMetrics.map((modelMetric) => modelMetric.id);
    const modelMetricLogs = await ModelMetricLog.findAll({
      where: { modelMetricId: modelMetricIds },
      order: [['created_at', 'DESC']],
    });

    const maxIds = modelMetricLogs.reduce((acc, modelMetricLog) => {
      if (!acc[modelMetricLog.modelMetricId]) {
        acc[modelMetricLog.modelMetricId] = modelMetricLog.id;
      }
      return acc;
    }, {});

    let modelMetricLogsByModelMetricId = modelMetricLogs.reduce(
      (acc, modelMetricLog) => {
        if (modelMetricLog.id === maxIds[modelMetricLog.modelMetricId]) {
          acc[modelMetricLog.modelMetricId] = modelMetricLog;
        }
        return acc;
      },
      {}
    );
    const transformedModelMetricLogsByModelMetricId = {};

    for (
      let i = 0;
      i < Object.keys(modelMetricLogsByModelMetricId).length;
      i++
    ) {
      const key = Object.keys(modelMetricLogsByModelMetricId)[i];
      const metric = modelMetricLogsByModelMetricId[key];
      if (metric.label === 'health_check') {
        if (metric.value === 0) {
          metric.value = 'Error';
        } else {
          if (await failedCheckInLast24H(modelId)) {
            metric.value = 'Warning';
          } else {
            metric.value = 'Success';
          }
        }
      }
      transformedModelMetricLogsByModelMetricId[key] = metric;
    }

    const alertsCount = await model.getLastAlertsCount();
    const errorsCount = await model.getLastErrorsCount();
    const lastAlertsByHour = await model.getLastAlertsHourByHour();

    return {
      ...model.dataValues,
      lastAlerts: alertsCount,
      lastErrors: errorsCount,
      lastAlertsByHour,
      modelMetrics: modelMetrics.map((modelMetric) => {
        const modelMetricLog =
          transformedModelMetricLogsByModelMetricId[modelMetric.id];
        return {
          ...modelMetric.toJSON(),
          modelMetricLog: modelMetricLog ? modelMetricLog.toJSON() : null,
          lastModelMetricLogTime: modelMetricLog
            ? modelMetricLog.createdAt
            : null,
        };
      }),
    };
  });
  const data = await Promise.all(modelDataPromises);
  return data;
};
