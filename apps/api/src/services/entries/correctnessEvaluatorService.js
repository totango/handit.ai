import _ from 'lodash';

export const expected = (log) =>
  log.actual && (log.actual.class ? log.actual.class : log.actual[0] === 1 ? 'Yes' : 'No');
export const predicted = (log) =>
  log.actual && log.actual.modelClass ? log.actual.modelClass : log.predicted && log.predicted[0] === 1 ? 'Yes' : 'No';

const cleanObject = (obj) => {
  if (!_.isObject(obj)) return obj;
  
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Check if value is none, null, "none", "null" or empty string
    if (value === null || 
        value === "none" || 
        value === "null" || 
        value === "" || 
        value === "None" || 
        value === "NULL" || 
        value === undefined) {
      return acc;
    }
    
    // If value is an object, clean it recursively
    if (_.isObject(value)) {
      const cleanedValue = cleanObject(value);
      if (!_.isEmpty(cleanedValue)) {
        acc[key] = cleanedValue;
      }
      return acc;
    }
    
    acc[key] = value;
    return acc;
  }, {});
};

export const isCorrect = (log) => {
  if (log.status === 'error') {
    return false;
  }
  if (!log.actual) {
    return false;
  }
  if (Object.keys(log.actual).includes('correct')) {
    return typeof log.actual.correct === 'boolean' ? log.actual.correct : Math.round(log.actual.correct) === 1;
  }
  const expectedOutput = expected(log);
  const predictedOutput = predicted(log);

  // If both are objects, clean them before comparison
  if (_.isObject(expectedOutput) && _.isObject(predictedOutput)) {
    const cleanedExpected = cleanObject(expectedOutput);
    const cleanedPredicted = cleanObject(predictedOutput);
    return _.isEqual(cleanedExpected, cleanedPredicted);
  }

  // if both are json compare the json
  if (_.isEqual(expectedOutput, predictedOutput)) {
    return true;
  }

  return expectedOutput === predictedOutput;
};
