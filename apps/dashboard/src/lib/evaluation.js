/**
 * @fileoverview Model evaluation utilities
 * Provides functions for evaluating model predictions and determining correctness
 */

/**
 * Extracts the expected value from a log entry
 * @function
 * @param {Object} log - Log entry containing actual values
 * @param {Object} log.actual - Actual values object
 * @param {string} [log.actual.class] - Class label if available
 * @param {Array<number>} [log.actual] - Binary array if class not available
 * @returns {string} Expected value ('Yes' or 'No')
 * 
 * @description
 * Determines the expected value from a log entry by:
 * - Checking for class property
 * - Falling back to binary array check
 * - Converting to 'Yes'/'No' format
 */
export const expected = (log) =>
  log.actual && (log.actual.class ? log.actual.class : log.actual[0] === 1 ? 'Yes' : 'No');

/**
 * Extracts the predicted value from a log entry
 * @function
 * @param {Object} log - Log entry containing actual and predicted values
 * @param {Object} log.actual - Actual values object
 * @param {string} [log.actual.modelClass] - Model's class prediction
 * @param {Object} log.predicted - Predicted values object
 * @param {Array<number>} [log.predicted] - Binary array if modelClass not available
 * @returns {string} Predicted value ('Yes' or 'No')
 * 
 * @description
 * Determines the predicted value from a log entry by:
 * - Checking for modelClass property
 * - Falling back to predicted binary array
 * - Converting to 'Yes'/'No' format
 */
export const predicted = (log) =>
  log.actual && log.actual.modelClass ? log.actual.modelClass : log.predicted && log.predicted[0] === 1 ? 'Yes' : 'No';

/**
 * Determines if a prediction is correct
 * @function
 * @param {Object} log - Log entry to evaluate
 * @param {Object} log.actual - Actual values object
 * @param {boolean|number} [log.actual.correct] - Explicit correctness value
 * @returns {boolean} Whether the prediction is correct
 * 
 * @description
 * Evaluates prediction correctness by:
 * - Checking for explicit correctness value
 * - Converting numeric correctness to boolean
 * - Comparing expected and predicted values
 * - Handling missing or invalid data
 */
export const isCorrect = (log) => {
  if (!log.actual) {
    return false;
  }
  if (Object.keys(log.actual).includes('correct')) {
    return typeof log.actual.correct === 'boolean' ? log.actual.correct : Math.round(log.actual.correct) === 1;
  }
  return expected(log) == predicted(log);
};
