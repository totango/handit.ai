/**
 * @fileoverview Alert Service for Sandbox Environment
 * Provides mock data generation for alert-related functionality in sandbox mode
 */

/**
 * Process alert sandbox request and return appropriate mock data
 * @param {Object} args - Request arguments
 * @param {string} args.url - Request URL
 * @returns {Object} Mock alert data
 * 
 * @description
 * Determines the type of alert data to return based on the URL and current path.
 * Returns either error-specific or general alert data.
 */
export const processAlertSandboxRequest = (args) => {
  const { url } = args;

  if (url.includes('alerts/')) {
    const id = url.split('/').pop();
    // if window url includes monitoring
    if (window.location.pathname.includes('error')) {
      return { data: generateMockAlertData() };
    } else {
      return { data: generateAlertDetail(parseInt(id)) };
    }
  }
};

/**
 * Generate detailed alert data for a specific alert ID
 * @param {number} alertId - ID of the alert
 * @returns {Object} Detailed alert data
 * 
 * @description
 * Creates a mock alert with randomized metrics and severity.
 * Includes model metrics, values, and associated logs.
 */
function generateAlertDetail(alertId) {
  return {
    id: alertId,
    severity: alertId % 2 === 0 ? "info" : "critical",  // Alternate between "info" and "critical"
    description: `Alert triggered for metric with value ${Math.random().toFixed(6)}`,
    data: {
      modelMetric: ["f1", "precision", "recall", "accuracy"][Math.floor(Math.random() * 4)], // Random metric type
      value: Math.random(),
      avgValue: Math.random(),
      targetValue: 1,
      logs: generateDetailedLogs(alertId)
    },
    modelMetricId: 1,
    type: "metric",
    modelId: 1,
    deletedAt: null,
    createdAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))).toISOString(),
    updatedAt: new Date().toISOString(),
    model_id: 1
  };
}

/**
 * Generate detailed logs for an alert
 * @param {number} alertId - ID of the alert
 * @returns {Array<Object>} Array of log entries
 * 
 * @description
 * Creates a random number of log entries with mock input/output data.
 * Each log includes chat completion details and processing status.
 */
function generateDetailedLogs(alertId) {
  return Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, idx) => ({
    id: idx + 1,
    input: `[{"role":"user","content":"Example input for alert ${alertId} log ${idx}"}]`,
    output: `{"id":"chatcmpl-ABCDE${idx + 100}","object":"chat.completion","created":${Date.now() / 1000},"model":"gpt-3.5-turbo","choices":[{"index":0,"message":{"role":"assistant","content":"${idx % 2 === 0 ? "Yes" : "No"}"}}],"usage":{"prompt_tokens":32,"completion_tokens":1,"total_tokens":33}}`,
    parameters: "{}",
    isCorrect: idx % 2 === 0 ? "True" : "False",
    processed: "False",
    metricProcessed: "False",
    actual: "NULL",
    predicted: `[${idx % 2 === 0 ? "\"Yes\"" : "\"No\""}]`,
    deletedAt: "NULL",
    modelId: 1,
    createdAt: new Date(new Date().setHours(new Date().getHours() - idx * 5)).toISOString(),
    updatedAt: new Date().toISOString(),
    model_id: 1
  }));
}

/**
 * Generate mock alert data with error statistics
 * @returns {Object} Mock alert data with error grouping
 * 
 * @description
 * Creates a comprehensive mock alert dataset including:
 * - Single alert details
 * - Grouped error statistics
 * - Time-based error distributions
 * - Error counts and timestamps
 */
function generateMockAlertData() {
  const modelId = 1;
  const modelMetricId = 5;
  const now = new Date();

  return {
    alert: generateAlert(modelId, modelMetricId),
    grouped: {
      errors: generateMultipleErrors(modelId, modelMetricId),
      errorsByDay: generateErrorsByTime("day"),
      errorsByHour: generateErrorsByTime("hour"),
      totalErrors: Math.floor(Math.random() * 50),
      totalErrorsLast30Days: Math.floor(Math.random() * 100),
      firstSeen: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      lastSeen: now.toISOString()
    }
  };
}

/**
 * Generate a single alert
 * @param {number} modelId - ID of the model
 * @param {number} modelMetricId - ID of the model metric
 * @returns {Object} Alert data
 * 
 * @description
 * Creates a mock alert with randomized severity and error details.
 * Includes endpoint information and status codes.
 */
function generateAlert(modelId, modelMetricId) {
  const alertId = Math.floor(Math.random() * 1000);
  const now = new Date();

  return {
    id: alertId,
    severity: Math.random() > 0.5 ? "critical" : "info",
    description: "Error message",
    data: {
      message: "Unauthorized access to the endpoint",
      endpoint: `https://api.example.com/data/${alertId}`,
      status: Math.random() > 0.5 ? 500 : 408,
      title: `Error in call to endpoint: https://api.example.com/data/${alertId}`
    },
    modelMetricId: modelMetricId,
    type: "error",
    modelId: modelId,
    deletedAt: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    model_id: modelId
  };
}

/**
 * Generate multiple error alerts
 * @param {number} modelId - ID of the model
 * @param {number} modelMetricId - ID of the model metric
 * @param {number} [count=5] - Number of errors to generate
 * @returns {Array<Object>} Array of error alerts
 * 
 * @description
 * Creates an array of mock error alerts with the specified count.
 * Each error has unique randomized data.
 */
function generateMultipleErrors(modelId, modelMetricId, count = 5) {
  return Array.from({ length: count }, () => generateAlert(modelId, modelMetricId));
}

/**
 * Generate error counts by time period
 * @param {string} type - Time period type ('day' or 'hour')
 * @returns {Object} Time-based error counts
 * 
 * @description
 * Creates a distribution of error counts over time.
 * For 'day' type: 30 days of data
 * For 'hour' type: 24 hours of data
 * Each time period has a random error count.
 */
function generateErrorsByTime(type) {
  const times = type === "day" ? 30 : 24;
  const result = {};
  const date = new Date();

  for (let i = 0; i < times; i++) {
    const formattedDate = type === "day" ?
      date.toUTCString().split(' ').slice(0, 4).join(' ') + " 00:00:00 GMT" :
      date.toUTCString().split(' ').slice(0, 4).join(' ') + ` ${String(23 - i).padStart(2, '0')}:00:00 GMT`;

    result[formattedDate] = Math.floor(Math.random() * 10); // Random count between 0 and 9

    // Adjust date for next iteration
    if (type === "day") {
      date.setDate(date.getDate() - 1);
    } else {
      date.setHours(date.getHours() - 1);
    }
  }

  return result;
}