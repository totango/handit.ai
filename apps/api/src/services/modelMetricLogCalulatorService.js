import binaryClassCalculator from "../calculators/metrics/binaryClassCalculator.js";
import languageCalculator from "../calculators/metrics/languageCalculator.js";
import multiClassCalculator from "../calculators/metrics/multiClassCalculator.js";
import multiLabelCalculator from "../calculators/metrics/multiLabelCalculator.js";

const calculators = {
  multi_class: multiClassCalculator,
  binary_class: binaryClassCalculator,
  classification: multiClassCalculator,
  multi_label: multiLabelCalculator,
  text_generation: languageCalculator,
  mapping: languageCalculator,
  generation: languageCalculator,
  data_extraction: languageCalculator,
};

export const executeCalculateMetricsForModel = async (model, ModelMetricLog, logVersion = null) => {
  const notProcessedLogs = await model.getMetricUnprocessedLogs();

  const modelMetrics = await model.getModelMetrics();

  if (notProcessedLogs.length < 30) {
    return { message: 'No logs found for model' };
  }

  // iterate over modelMetrics
  for (let j = 0; j < modelMetrics.length; j++) {
    const metric = modelMetrics[j];


    const mapping = model.parameters?.mapping;
    const calculator = calculators[model.problemType];
    if (!calculator) {
      console.log(`No calculator found for problem type: ${model.problemType}`);
      continue;
    }

    const value = await calculator.calculateMetric(
      metric,
      notProcessedLogs,
      mapping || {}
    );

    // save metric value
    await ModelMetricLog.create({
      modelMetricId: metric.dataValues.id,
      value: value || 0,
      label: metric.dataValues.name,
      logs: [],
      version: logVersion,
    });
  }

  // update logs
  for (const log of notProcessedLogs) {
    await log.update({ metricProcessed: true });
  }
};