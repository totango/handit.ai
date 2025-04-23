import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const analyticsClient = new BetaAnalyticsDataClient({
  keyFilename: 'handit.json'
});
