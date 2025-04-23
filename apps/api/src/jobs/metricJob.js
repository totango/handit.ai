import { metricQueue } from '../services/queue.js';

export const addMetricJob = async (metricData) => {
  await metricQueue.add(metricData, {
    repeat: {
      cron: metricData.cronTime,
    },
  });
};
