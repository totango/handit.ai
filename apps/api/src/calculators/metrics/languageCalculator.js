// Define functions to calculate average scores for each metric

async function calculateAverageRelevance(logs) {
  const totalRelevance = logs.reduce((sum, log) => sum + (log.dataValues.actual.relevance / 10.0), 0);
  return parseFloat(totalRelevance / logs.length).toFixed(2);
}

async function calculateAverageCoherence(logs) {
  const totalCoherence = logs.reduce((sum, log) => sum + (log.dataValues.actual.coherence / 10.0), 0);
  return parseFloat(totalCoherence / logs.length).toFixed(2);
}

async function calculateAccuracy(logs) {
  const correctPredictions = logs.reduce((sum, log) => {
    const value = log.dataValues.actual.correct;
    const correctValue = typeof value === 'boolean' 
      ? (value ? 1 : 0)  
      : (parseFloat(value)) || 0; 

    return sum + (correctValue * 1.0);
  }, 0.0);

  return parseFloat(correctPredictions*1.0 / logs.length).toFixed(2);
}

// Define an object with the metric calculation functions

const qualitativeMetrics = {
  average_relevance: calculateAverageRelevance,
  average_coherence: calculateAverageCoherence,
  accuracy: calculateAccuracy,
};

// Define the calculateQualitativeMetric function

async function calculateMetric(metric, logs) {
  const metricFunction = qualitativeMetrics[metric.dataValues.name];
  if (!metricFunction) {
    console.log(`No function found for metric: ${metric.dataValues.name}`);
    return null;
  }

  try {
    const result = await metricFunction(logs);
    return parseFloat(result).toFixed(2);
  } catch (error) {
    throw new Error(`Error calculating ${metric}: ${error.message}`);
  }
}

// Directly export the functions without re-declaring them
export default {
  calculateAverageRelevance,
  calculateAverageCoherence,
  calculateAccuracy,
  calculateMetric,
};
