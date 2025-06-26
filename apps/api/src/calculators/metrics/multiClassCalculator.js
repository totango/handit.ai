// metrics_multiclass.js

import { isCorrect } from "../../services/entries/correctnessEvaluatorService.js";

const basicVariables = {
  "false_positive": calculateFalsePositive,
  "false_negative": calculateFalseNegative,
  "true_positive": calculateTruePositive,
  "true_negative": calculateTrueNegative,
  "real_true": calculateTrue,
  "real_false": calculateFalse,
};

// Calculate True Positives for multi-class classification
async function calculateTruePositive(logs) {
  // Count cases where predicted class matches actual class
  return logs.filter(log => 
    isCorrect(log)
  ).length;
}

// Calculate False Positives for multi-class classification
async function calculateFalsePositive(logs) {
  // Count cases where predicted class doesn't match actual class
  return logs.filter(log => 
    !isCorrect(log)
  ).length;
}

// Calculate False Negatives for multi-class classification
async function calculateFalseNegative(logs) {
  // For string-based classes, false negatives are the same as false positives
  return calculateFalsePositive(logs);
}

// Calculate True Negatives for multi-class classification
async function calculateTrueNegative(logs) {
  return logs.filter(log => isCorrect(log)).length;
}

// Calculate total actual positives (total number of samples)
async function calculateTrue(logs) {
  return logs.length;
}

// Calculate total actual negatives
async function calculateFalse(logs) {
  return logs.length;
}

async function calculateMetric(metric, logs, mapping = {}) {
  if (metric.dataValues.name === 'Healtcheck') {
    return 1;
  }
  const formula = metric.parameters.formula || metric.parameters.function;

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

export default {
  calculateFalsePositive,
  calculateFalseNegative,
  calculateTruePositive,
  calculateTrueNegative,
  calculateTrue,
  calculateFalse,
  calculateMetric,
};
