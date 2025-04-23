async function calculateFalsePositive(logs, mapping) {
  const falsePositive = logs.filter(log => mapping[log.dataValues.actual['modelClass']] == 1 && mapping[log.dataValues.actual['class']] == 0);
  return parseFloat(falsePositive.length).toFixed(2);
}

async function calculateFalseNegative(logs, mapping) {
  const falseNegative = logs.filter(log => mapping[log.dataValues.actual['modelClass']] == 0 && mapping[log.dataValues.actual['class']] == 1);
  return parseFloat(falseNegative.length).toFixed(2);
}

async function calculateTruePositive(logs, mapping) {
  const truePositive = logs.filter(log => mapping[log.dataValues.actual['modelClass']] == 1 && mapping[log.dataValues.actual['class']] == 1);
  return parseFloat(truePositive.length).toFixed(2);
}

async function calculateTrueNegative(logs, mapping) {
  const trueNegative = logs.filter(log => mapping[log.dataValues.actual['modelClass']] == 0 && mapping[log.dataValues.actual['class']] == 0);
  return parseFloat(trueNegative.length).toFixed(2);
}

async function calculateTrue(logs, mapping) {
  const trueValues = logs.filter(log => mapping[log.dataValues.actual['class']] == 1);
  return parseFloat(trueValues.length).toFixed(2);
}

async function calculateFalse(logs, mapping) {
  const falseValues = logs.filter(log => mapping[log.dataValues.actual['class']] == 0);
  return parseFloat(falseValues.length).toFixed(2);
}

// Now, you can define basicVariables using these functions

const basicVariables = {
  false_positive: calculateFalsePositive,
  false_negative: calculateFalseNegative,
  true_positive: calculateTruePositive,
  true_negative: calculateTrueNegative,
  real_true: calculateTrue,
  real_false: calculateFalse,
};

// Define the calculateMetric function

async function calculateMetric(metric, logs, mapping = {}) {
  const formula = metric.dataValues.parameters.function;
  const values = {};
  mapping[0] = 0;
  mapping[1] = 1;
  for (const variable of Object.keys(basicVariables)) {
    const result = await basicVariables[variable](logs, mapping);
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

// Directly export the functions without re-declaring them
export default { 
  calculateFalsePositive, 
  calculateFalseNegative, 
  calculateTruePositive, 
  calculateTrueNegative, 
  calculateTrue, 
  calculateFalse, 
  calculateMetric 
};
