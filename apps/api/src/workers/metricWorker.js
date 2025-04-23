// workers/metricWorker.js

import { metricQueue } from '../services/queue.js';
import db from '../../models/index.js';
import multiClassCalculator from '../calculators/metrics/multiClassCalculator.js';
import binaryClassCalculator from '../calculators/metrics/binaryClassCalculator.js';
import multiLabelCalculator from '../calculators/metrics/multiLabelCalculator.js';
import languageCalculator from '../calculators/metrics/languageCalculator.js';

const { Model, ModelMetricLog } = db;

const calculators = {
  'multi_class': multiClassCalculator,
  'binary_class': binaryClassCalculator,
  'multi_label': multiLabelCalculator,
  'text_generation': languageCalculator,
  'classification': multiClassCalculator,
};

metricQueue.process(async (job) => {
  const models = await Model.findAll();

  // iterate over models
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const modelLogs = await model.getModelLogs();
    const notProcessedLogs = modelLogs.filter((log) => log.processed && !log.metricProcessed);
    const modelMetrics = await model.getModelMetrics();

    if (notProcessedLogs.length === 0) {
      console.log(`No metrics found for model: ${model.name}`);
      continue;
    }

    // iterate over modelMetrics
    for (let j = 0; j < modelMetrics.length; j++) {
      const metric = modelMetrics[j];
      const formula = metric.parameters.function;

      if (!formula) {
        console.log(`No formula found for metric: ${metric.name}`);
        continue;
      }

      const mapping = model.params?.mapping;
      const calculator = calculators[model.problemType];

      if (!calculator) {
        console.log(`No calculator found for problem type: ${model.problemType}`);
        continue;
      }

      const value = await calculator.calculateMetric(metric, notProcessedLogs, mapping || {});
      const data = notProcessedLogs.map((log) => log.dataValues);
      // save metric value
      await ModelMetricLog.create({
        modelMetricId: metric.id,
        value: value || 0,
        label: metric.name,
        logs: data,
      });
    }

    // update logs
    for (const log of notProcessedLogs) {
      await log.update({ metricProcessed: true });
    }
  }
});

metricQueue.on('completed', (job, result) => {
  console.log(`Metric job completed.`);
});

metricQueue.on('failed', (job, err) => {
  console.log(`Metric job failed with error ${err}`);
});
