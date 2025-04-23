import { llmModelNamesAndDescriptions, providers } from "@/constants/models";

const status = [
  'success', 'warning', 'error'
]

export const processModelMetricsSandboxRequest = (args) => {
  const { url } = args;

  if (url === 'model-metrics/me') {
    return {data: generateMockModelsData()};
  } else if(url.includes('model-metrics/model/')) {
    const modelId = url.split('/').pop();
    return {data: generateDetailedModelData(parseInt(modelId))};
  }
};

function generateMockModelsData() {
  const modelsData = [];

  for (let i = 1; i <= 5; i++) {
    const data = llmModelNamesAndDescriptions[Math.floor(Math.random() * llmModelNamesAndDescriptions.length)];
    const model = {
      id: i,
      name: data.name,
      url: `https://example.com/model-${i}`,
      provider: i === 1 ? 'OpenAI (GPT models)' : providers[Math.floor(Math.random() * providers.length)].label,
      description: data.description,
      problemType: "binary_class",
      modelCreationDate: new Date(new Date().setDate(new Date().getDate() - i * 10)).toISOString(),
      slug: `model-${i}`,
      parameters: null,
      modelGroupId: i,
      type: "largeLanguageModel",
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model_group_id: i,
      lastAlerts: Math.floor(Math.random() * 10),
      lastHealthErrorDays: Math.floor(Math.random() * 30),
      lastAlertCreatedAt: new Date().toISOString(),
      lastErrors: Math.floor(Math.random() * 5),
      alerts: generateAlerts(i),
      groupedAlerts: {
        metricAlerts: generateMetricAlerts(i),
        errorAlerts: generateErrorAlerts(i),
      },
      numberOfAlertsByType: {
        info: Math.floor(Math.random() * 50),
        critical: Math.floor(Math.random() * 20),
        error: Math.floor(Math.random() * 10),
      },
      numberOfAlertsByTypeThisMonth: {
        info: Math.floor(Math.random() * 50),
        critical: Math.floor(Math.random() * 20),
        error: Math.floor(Math.random() * 10),
      },
      differenceAlertsByType: {
        info: Math.floor(Math.random() * 50),
        critical: Math.floor(Math.random() * 20),
        error: Math.floor(Math.random() * 10),
      },
      lastAlertsByHour: generateAlertsByTime("hour"),
      lastAlerts30Days: generateAlertsByTime("day"),
      modelMetrics: [{
        type: 'health_check',
        modelId: i,
        modelMetricLog: {
        value: status[Math.floor(Math.random() * 100) % 3],
        }
      }, ...generateMetrics(i)],

      // New metrics data
      lastModelMetrics: generateLastModelMetrics(),
      avgModelMetricsCurrentMonth: generateAvgModelMetrics(),
      avgModelMetricsLastMonth: generateAvgModelMetrics(),
      differenceModelMetrics: generateDifferenceModelMetrics()
    };

    modelsData.push(model);
  }

  return modelsData;
}

function generateLastModelMetrics() {
  return {
    "61": createMetricLog("accuracy", 0.85),
    "62": createMetricLog("average relevance", 0.72),
    "63": createMetricLog("average coherence", 0.65),
  };
}

function generateAvgModelMetrics() {
  return {
    "61": (Math.random() * 0.5 + 0.5).toFixed(2),
    "62": (Math.random() * 0.5 + 0.5).toFixed(2), // random between 0.5 and 1.0
    "63": (Math.random() * 0.5 + 0.5).toFixed(2),
  };
}

function generateDifferenceModelMetrics() {
  return {
    "61": (Math.random() * 0.5).toFixed(2),
    "62": (Math.random() * 0.5).toFixed(2), // random between 0.0 and 0.5
    "63": (Math.random() * 0.5).toFixed(2)
  };
}

// Utility to create a metric log with sample data
function createMetricLog(label, value) {
  const modelMetricId = Math.floor(Math.random() * 100) + 60; // random ID for demo
  return {
    id: modelMetricId,
    value: value,
    description: null,
    label: label,
    modelMetricId: modelMetricId,
    deletedAt: null,
    logs: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model_metric_id: modelMetricId
  };
}

function generateAlerts(modelId) {
  return Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, idx) => ({
    id: idx + 1,
    severity: idx % 2 === 0 ? "info" : "critical",
    description: `Alert for model metric ${modelId} with random value`,
    data: {
      modelMetric: "f1",
      value: Math.random(),
      avgValue: Math.random(),
      targetValue: Math.random(),
      logs: generateLogs(modelId),
    },
    modelMetricId: modelId,
    type: "metric",
    modelId,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model_id: modelId,
  }));
}

function generateMetricAlerts(modelId) {
  return Array.from({ length: 2 }).map((_, idx) => ({
    id: idx + 1,
    severity: idx % 2 === 0 ? "info" : "critical",
    description: `Metric Alert for model ${modelId}`,
    data: {
      modelMetric: "recall",
      value: Math.random(),
      avgValue: Math.random(),
      targetValue: Math.random(),
      logs: generateLogs(modelId),
    },
    modelMetricId: modelId,
    type: "metric",
    modelId,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model_id: modelId,
  }));
}

function generateErrorAlerts(modelId) {
  const errors = ["Database connection timed out", "Unauthorized access to endpoint"];
  return errors.reduce((acc, error, idx) => {
    acc[error] = {
      errors: [
        {
          id: idx + 1,
          severity: idx % 2 === 0 ? "info" : "critical",
          description: "Error message",
          data: {
            message: error,
            endpoint: `https://api.example.com/data/${idx}`,
            status: idx % 2 === 0 ? 500 : 408,
            title: `Error at endpoint ${idx}`,
          },
          modelMetricId: modelId,
          type: "error",
          modelId,
          deletedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          model_id: modelId,
        },
      ],
      errorsByDay: generateAlertsByTime("day"),
      errorsByHour: generateAlertsByTime("hour"),
      totalErrors: Math.floor(Math.random() * 10),
      totalErrorsLast30Days: Math.floor(Math.random() * 50),
      firstSeen: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
      lastSeen: new Date().toISOString(),
    };
    return acc;
  }, {});
}

function generateLogs(modelId) {
  return Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, idx) => ({
    id: idx + 1,
    input: `[{\"role\":\"user\",\"content\":\"Mock input for model ${modelId}\"}]`,
    output: `{\"id\":\"output${idx}\",\"message\":\"Mock output for log ${idx}\"}`,
    parameters: "{}",
    isCorrect: idx % 2 === 0 ? "True" : "False",
    processed: "False",
    metricProcessed: "False",
    actual: "NULL",
    predicted: `["output${idx}"]`,
    deletedAt: "NULL",
    modelId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model_id: modelId,
  }));
}

function generateMetrics(modelId) {
  const metricNames = ["accuracy", "precision", "recall", "f1"];
  return metricNames.map((name, idx) => ({
    id: idx + 1,
    name,
    description: `${name} of the model`,
    parameters: {
      function: "Sample formula for metric calculation",
    },
    type: "numeric",
    modelId,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model_id: modelId,
    modelMetricLog: {
      id: idx + 1,
      value: Math.random(),
      description: null,
      label: name,
      modelMetricId: modelId,
      deletedAt: null,
      logs: generateLogs(modelId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model_metric_id: modelId,
    },
    lastModelMetricLogTime: new Date().toISOString(),
  }));
}

function generateAlertsByTime(type) {
  const times = type === "day" ? 30 : 24;
  const result = {};
  for (let i = 0; i < times; i++) {
    const date = new Date();
    if (type === "day") {
      date.setDate(date.getDate() - i);
    } else {
      date.setHours(date.getHours() - i);
    }
    const timeKey = date.toUTCString();
    result[timeKey] = Math.floor(Math.random() * 5);
  }
  return result;
}

function getRandomModelInfo() {
  return llmModelNamesAndDescriptions[Math.floor(Math.random() * llmModelNamesAndDescriptions.length)];
}// Function to generate a detailed model
export function generateDetailedModelData(modelId) {
  const modelInfo = getRandomModelInfo();  // Reuse the random name and description function
  
  return {
    id: modelId,
    name: modelInfo.name,
    url: `https://example.com/${modelInfo.name.toLowerCase().replace(/\s+/g, '-')}`,
    provider: modelId === 1 ? "OpenAI (GPT models)" : providers[Math.floor(Math.random() * providers.length)].label,
    description: modelInfo.description,
    problemType: "binary_class",  // Or customize as needed
    modelCreationDate: new Date(new Date().setDate(new Date().getDate() - modelId * 10)).toISOString(),
    slug: modelInfo.name.toLowerCase().replace(/\s+/g, '-'),
    parameters: null,
    modelGroupId: modelId,
    type: "largeLanguageModel",
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model_group_id: modelId,
    lastAlerts: Math.floor(Math.random() * 10),
    lastHealthErrorDays: Math.floor(Math.random() * 30),
    lastAlertCreatedAt: new Date().toISOString(),
    lastErrors: Math.floor(Math.random() * 5),
    alerts: generateAlerts(modelId),
    groupedAlerts: generateGroupedAlerts(modelId),
    numberOfAlertsByType: {
      info: Math.floor(Math.random() * 50),
      critical: Math.floor(Math.random() * 20),
      error: Math.floor(Math.random() * 10),
    },
    numberOfAlertsByTypeThisMonth: {
      info: Math.floor(Math.random() * 50),
      critical: Math.floor(Math.random() * 20),
      error: Math.floor(Math.random() * 10),
    },
    differenceAlertsByType: {
      info: Math.floor(Math.random() * 50),
      critical: Math.floor(Math.random() * 20),
      error: Math.floor(Math.random() * 10),
    },
    lastAlertsByHour: generateAlertsByTime("hour"),
    lastAlerts30Days: generateAlertsByTime("day"),
    modelMetrics: generateMetrics(modelId),

    // New metrics data
    lastModelMetrics: generateLastModelMetrics(),
    avgModelMetricsCurrentMonth: generateAvgModelMetrics(),
    avgModelMetricsLastMonth: generateAvgModelMetrics(),
    differenceModelMetrics: generateDifferenceModelMetrics()
  };
}


// Function to generate grouped alerts for a model
function generateGroupedAlerts(modelId) {
  return {
    metricAlerts: generateMetricAlerts(modelId),
    errorAlerts: generateErrorAlerts(modelId),
  };
}

// Function to generate model metrics logs for detailed data
function generateDetailedMetricLogs(modelMetricId) {
  return Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, idx) => ({
    id: idx + 1,
    value: Math.random(),
    description: null,
    label: `metric-${idx + 1}`,
    modelMetricId: modelMetricId,
    deletedAt: null,
    logs: generateLogs(modelMetricId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model_metric_id: modelMetricId,
  }));
}
