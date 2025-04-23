// metrics_multilabel.js

const basicVariables = {
  "false_positive": calculateFalsePositive,
  "false_negative": calculateFalseNegative,
  "true_positive": calculateTruePositive,
  "true_negative": calculateTrueNegative,
  "real_true": calculateTrue,
  "real_false": calculateFalse,
};

// Function to calculate confusion matrix components per label
async function calculateConfusionMatrixPerLabel(logs) {
  const allLabels = new Set();
  logs.forEach(log => {
    log.actual.forEach(label => allLabels.add(label));
    log.predicted.forEach(label => allLabels.add(label));
  });

  const confusionMatrix = {};
  allLabels.forEach(label => {
    let tp = 0, fp = 0, fn = 0, tn = 0;
    logs.forEach(log => {
      const actualHasLabel = log.actual.includes(label);
      const predictedHasLabel = log.predicted.includes(label);

      if (actualHasLabel && predictedHasLabel) {
        tp += 1;
      } else if (!actualHasLabel && predictedHasLabel) {
        fp += 1;
      } else if (actualHasLabel && !predictedHasLabel) {
        fn += 1;
      } else {
        tn += 1;
      }
    });
    confusionMatrix[label] = { tp, fp, fn, tn };
  });

  return confusionMatrix;
}

// Calculate True Positives for multi-label classification
async function calculateTruePositive(logs) {
  let tp = 0;
  logs.forEach(log => {
    const actualLabels = new Set(log.actual);
    const predictedLabels = new Set(log.predicted);
    actualLabels.forEach(label => {
      if (predictedLabels.has(label)) {
        tp += 1;
      }
    });
  });
  return tp;
}

// Calculate False Positives for multi-label classification
async function calculateFalsePositive(logs) {
  let fp = 0;
  logs.forEach(log => {
    const actualLabels = new Set(log.actual);
    const predictedLabels = new Set(log.predicted);
    predictedLabels.forEach(label => {
      if (!actualLabels.has(label)) {
        fp += 1;
      }
    });
  });
  return fp;
}

// Calculate False Negatives for multi-label classification
async function calculateFalseNegative(logs) {
  let fn = 0;
  logs.forEach(log => {
    const actualLabels = new Set(log.actual);
    const predictedLabels = new Set(log.predicted);
    actualLabels.forEach(label => {
      if (!predictedLabels.has(label)) {
        fn += 1;
      }
    });
  });
  return fn;
}

// Calculate True Negatives for multi-label classification
async function calculateTrueNegative(logs) {
  let tn = 0;
  const allLabels = new Set();
  logs.forEach(log => {
    log.actual.forEach(label => allLabels.add(label));
    log.predicted.forEach(label => allLabels.add(label));
  });
  const totalPossible = logs.length * allLabels.size;
  const tp = await calculateTruePositive(logs);
  const fp = await calculateFalsePositive(logs);
  const fn = await calculateFalseNegative(logs);
  tn = totalPossible - tp - fp - fn;
  return tn;
}

// Calculate total actual positives (number of actual labels)
async function calculateTrue(logs) {
  let totalTrue = 0;
  logs.forEach(log => {
    totalTrue += log.actual.length;
  });
  return totalTrue;
}

// Calculate total actual negatives (number of possible negatives)
async function calculateFalse(logs) {
  let totalLabels = new Set();
  logs.forEach(log => {
    log.actual.forEach(label => totalLabels.add(label));
    log.predicted.forEach(label => totalLabels.add(label));
  });
  const totalPossibleLabels = totalLabels.size;
  const totalInstances = logs.length * totalPossibleLabels;
  const totalTrue = await calculateTrue(logs);
  return totalInstances - totalTrue;
}

// Function to calculate a specified metric based on the formula
async function calculateMetric(metric, logs, mapping = {}) {
  const formula = metric.parameters.formula;

  const values = {};

  for (const variable of Object.keys(basicVariables)) {
    const result = await basicVariables[variable](logs);
    values[variable] = result;
  }

  let calculatedFormula = formula;
  for (const [variable, value] of Object.entries(values)) {
    calculatedFormula = calculatedFormula.replace(new RegExp(`\\b${variable}\\b`, 'g'), value);
  }

  try {
    const result = new Function(`return ${calculatedFormula}`)();
    return result;
  } catch (error) {
    throw new Error(`Error evaluating formula: ${error.message}`);
  }
}

// Function to calculate per-label metrics using the confusion matrix
async function calculatePerLabelMetrics(logs) {
  const confusionMatrix = await calculateConfusionMatrixPerLabel(logs);
  const metricsPerLabel = {};

  for (const [label, { tp, fp, fn, tn }] of Object.entries(confusionMatrix)) {
    const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
    const f1Score = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
    metricsPerLabel[label] = { precision, recall, f1Score };
  }

  return metricsPerLabel;
}

export default {
  calculateFalsePositive,
  calculateFalseNegative,
  calculateTruePositive,
  calculateTrueNegative,
  calculateTrue,
  calculateFalse,
  calculateMetric,
  calculateConfusionMatrixPerLabel,
  calculatePerLabelMetrics,
};
