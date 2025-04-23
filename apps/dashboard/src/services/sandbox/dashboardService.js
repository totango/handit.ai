/**
 * @fileoverview Dashboard Service for Sandbox Environment
 * Provides mock data generation for dashboard-related functionality in sandbox mode
 */

/**
 * Process dashboard sandbox request and return appropriate mock data
 * @param {Object} args - Request arguments
 * @param {string} args.url - Request URL
 * @returns {Object} Mock dashboard data
 * 
 * @description
 * Handles dashboard data requests in sandbox mode.
 * Returns mock dashboard data for the main dashboard view.
 */
export const processDashboardSandboxRequest = (args) => {
  const { url } = args;

  if (url === 'dashboard') {
    return { data: sandboxGetDashboardData() };
  }
};

/**
 * Generate or retrieve dashboard data
 * @returns {Object} Dashboard data with alerts and statistics
 * 
 * @description
 * Generates mock dashboard data with the following structure:
 * - Critical, info, and error alerts for the last 30 days
 * - Alerts grouped by day and severity
 * - Alert change statistics
 * Data is cached in sessionStorage for consistency across requests.
 */
const sandboxGetDashboardData = () => {
  const sessionData = sessionStorage.getItem('dashboardData');

  if (sessionData) {
    // Retrieve from sessionStorage if data already exists
    return JSON.parse(sessionData);
  }

  // Generate new data if not in sessionStorage
  const alertsData = {
    criticalAlertsLast30Days: [],
    infoAlertsLast30Days: [],
    errorAlertsLast30Days: [],
    alertsGroupedByDayLast30Days: {
      info: {},
      critical: {},
      error: {},
    },
    criticalAlertsChange: -37,
    infoAlertsChange: -53,
    errorAlertsChange: -25,
  };

  // Alert configuration
  const severities = ['info', 'critical'];
  const types = ['error', 'monitoring'];
  const descriptions = [
    'Database connection lost',
    'Unauthorized access attempt',
    'Invalid API key provided',
    'Memory usage high',
    'Disk space low',
  ];

  // Generate 30 days of alert data
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    // Generate alerts for each type
    types.forEach((type) => {
      let mockedSeverity = severities;
      if (type === 'error') {
        mockedSeverity = ['critical'];
      }

      // Generate alerts for each severity
      severities.forEach((severity) => {
        const dailyAlerts = [];

        // Generate random number of alerts for each day
        for (let j = 0; j < Math.floor(Math.random() * 100) + 1; j++) {
          const alert = {
            id: Math.floor(Math.random() * 1000),
            severity: severity,
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            data: {
              message: descriptions[Math.floor(Math.random() * descriptions.length)],
              endpoint: `https://api.example.com/data/${Math.floor(Math.random() * 100)}`,
              status: severity === 'critical' ? 503 : 408,
              title: `Error in call to endpoint: https://api.example.com/data/${Math.floor(Math.random() * 100)}`,
            },
            modelMetricId: Math.floor(Math.random() * 10),
            type: type,
            modelId: Math.floor(Math.random() * 5) + 1,
            deletedAt: null,
            createdAt: new Date(date).toISOString(),
            updatedAt: new Date(date).toISOString(),
            model_id: Math.floor(Math.random() * 5) + 1,
          };

          dailyAlerts.push(alert);

          // Categorize alerts based on type and severity
          if (type === 'error') {
            alertsData.errorAlertsLast30Days.push(alert);
            alertsData.alertsGroupedByDayLast30Days['error'][dateString] = dailyAlerts;
          } else {
            if (severity === 'critical') {
              alertsData.criticalAlertsLast30Days.push(alert);
            } else {
              alertsData.infoAlertsLast30Days.push(alert);
            }
          }
          alertsData.alertsGroupedByDayLast30Days[severity][dateString] = dailyAlerts;
        }
      });
    });
  }

  // Save generated data to sessionStorage
  sessionStorage.setItem('dashboardData', JSON.stringify(alertsData));

  return alertsData;
};
