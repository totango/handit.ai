import db from '../../models/index.js';
import { redisService } from './redisService.js';

const { ModelMetric, ModelMetricLog, ModelGroup, Model, Alert, ModelLog } = db;

export const getBasicMetricOfModels = async (companyId) => {
  const modelGroups = await ModelGroup.findAll({ where: { companyId } });
  const modelGroupIds = modelGroups.map((modelGroup) => modelGroup.id);
  const models = await Model.findAll({
    where: { modelGroupId: modelGroupIds },
  });
  const modelIds = models.map((model) => model.id);

  const modelMetrics = await ModelMetric.findAll({
    where: { modelId: modelIds },
  });

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

  const modelMetricLogsByModelMetricId = modelMetricLogs.reduce(
    (acc, modelMetricLog) => {
      if (modelMetricLog.id === maxIds[modelMetricLog.modelMetricId]) {
        acc[modelMetricLog.modelMetricId] = modelMetricLog;
      }
      return acc;
    },
    {}
  );

  return models.map((model) => {
    const monitoring = {};
    const modelMetricsFiltered = modelMetrics.filter(
      (modelMetric) => modelMetric.modelId === model.id
    );

    modelMetricsFiltered.forEach((modelMetric) => {
      const modelMetricLog = modelMetricLogsByModelMetricId[modelMetric.id];
      if (modelMetricLog) {
        monitoring[modelMetric.name] = modelMetricLog.value;
      }
    });

    return {
      ...model.toJSON(),
      monitoring,
    };
  });
};

export const getListOfEntries = async (
  companyId,
  modelId = null,
  page = 1,
  pageSize = 10,
  type = 'verified',
  environment = 'production'
) => {
  let modelIds = [];
  if (modelId) {
    modelIds = [modelId];
  } else {
    const modelGroups = await ModelGroup.findAll({ where: { companyId } });
    const modelGroupIds = modelGroups.map((modelGroup) => modelGroup.id);
    const models = await Model.findAll({
      where: { modelGroupId: modelGroupIds },
    });
    modelIds = models.map((model) => model.id);
  }
  let entries = [];

  let cached = null;
  if (modelIds.length === 1) {
    const redisKey = `entries:${modelIds[0]}:${type}:${page}:${pageSize}:${environment}`;

    cached = await redisService.get(redisKey);
  }
  
  if (cached) {
    entries = JSON.parse(cached);
  } else if (type == 'all') {
    entries = await ModelLog.findAll({
      where: { modelId: modelIds, environment },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['created_at', 'DESC']],
    });
  } else {
    entries = await ModelLog.findAll({
      where: { modelId: modelIds, processed: type == 'verified', environment },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['created_at', 'DESC']],
    });
  }

  const totalEntries = await ModelLog.count({
    where: { modelId: modelIds, processed: type === 'verified', environment },
  });

  const amountVerified = await ModelLog.count({
    where: { modelId: modelIds, processed: true, environment },
    order: [['created_at', 'DESC']],
  });

  const amountUnverified = await ModelLog.count({
    where: { modelId: modelIds, processed: false, environment },
    order: [['created_at', 'DESC']],
  });

  const correct = await ModelLog.count({
    where: { modelId: modelIds, is_correct: true, processed: true, environment },
    order: [['created_at', 'DESC']],
  });

  const incorrect = await ModelLog.count({
    where: { modelId: modelIds, is_correct: false, processed: true, environment },
    order: [['created_at', 'DESC']],
  });

  return {
    amountVerified,
    amountUnverified,
    correct,
    incorrect,
    entries,
    totalEntries,
  };
};

export const getEntry = async (entryId) => {
  const entry = await ModelLog.findByPk(entryId);
  return entry;
};

export const getDetailedMetricOfModel = async (modelId) => {
  const model = await Model.findByPk(modelId);
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

  const historicMetriclogsByModelMetricId = modelMetricLogs.reduce(
    (acc, modelMetricLog) => {
      if (!acc[modelMetricLog.modelMetricId]) {
        acc[modelMetricLog.modelMetricId] = [];
      }
      acc[modelMetricLog.modelMetricId].push(modelMetricLog);
      return acc;
    },
    {}
  );

  const modelMetricLogsByModelMetricId = modelMetricLogs.reduce(
    (acc, modelMetricLog) => {
      if (modelMetricLog.id === maxIds[modelMetricLog.modelMetricId]) {
        acc[modelMetricLog.modelMetricId] = modelMetricLog;
      }
      return acc;
    },
    {}
  );

  const monitoring = {};
  modelMetrics.forEach((modelMetric) => {
    const modelMetricLog = modelMetricLogsByModelMetricId[modelMetric.id];
    if (modelMetricLog) {
      monitoring[modelMetric.name] = modelMetricLog.value;
    }
  });

  const historicMonitoring = {};
  modelMetrics.forEach((modelMetric) => {
    const modelMetricLogs = historicMetriclogsByModelMetricId[modelMetric.id];
    if (modelMetricLogs) {
      historicMonitoring[modelMetric.name] = modelMetricLogs.map(
        (modelMetricLog) => ({
          value: modelMetricLog.value,
          createdAt: modelMetricLog.createdAt,
        })
      );
    }
  });

  const alerts = await Alert.findAll({
    where: { modelId },
    order: [['created_at', 'DESC']],
  });

  return {
    ...model.toJSON(),
    monitoring,
    historicMonitoring,
    alerts,
  };
};
