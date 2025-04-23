/**
 * @fileoverview Main Sandbox Service
 * Provides centralized request handling and routing for all sandbox functionality
 */

import { processDashboardSandboxRequest } from './dashboardService';
import { processModelMetricsSandboxRequest } from './modelMetricsService';
import { processAlertSandboxRequest } from './alertService';
import { processModelsSandboxRequest } from './modelsService';
import { processDatasetsSandboxRequest } from './datasetsService';
import { processUsersSandboxRequest } from './usersService';
import { processEntriesSandboxRequest } from './entriesService';

/**
 * Handle sandbox requests and route them to appropriate service handlers
 * @param {Object|string} args - Request arguments or URL string
 * @param {string} [args.url] - Request URL
 * @param {string} [args.method] - HTTP method
 * @param {Object} [args.body] - Request body for PUT requests
 * @returns {Object} Response data or error message
 * 
 * @description
 * Central routing function for all sandbox requests:
 * - Dashboard data
 * - Model metrics
 * - Alerts
 * - Models
 * - Datasets
 * - Users
 * - Monitoring entries
 * 
 * Also handles specific monitoring endpoints:
 * - GET /monitoring/list/me
 * - GET /monitoring/entry
 * - PUT requests for entry updates
 */
export const handleSandboxResponse = (args) => {
  let { url, method } = args;
  if (typeof args === 'string') {
    url = args;
    method = 'GET';
  }
  if (url.includes('dashboard')) {
    return processDashboardSandboxRequest(args);
  } else if (url.includes('model-metrics')) {
    return processModelMetricsSandboxRequest(args);
  } else if (url.includes('alerts')) {
    return processAlertSandboxRequest(args);
  } else if (url.includes('models')) {
    return processModelsSandboxRequest(args);
  } else if (url.includes('datasets')) {
    return processDatasetsSandboxRequest(args);
  } else if (url.includes('users')) {
    return processUsersSandboxRequest(args);
  } else if (url.includes('monitoring')) {
    return processEntriesSandboxRequest(args);
  }

  if (method === 'GET' && url.includes('monitoring/list/me')) {
    return sandboxGetListOfEntries();
  }

  if (method === 'GET' && url.includes('monitoring/entry')) {
    return sandboxGetEntryDetails();
  }

  if (method === 'PUT') {
    return sandboxUpdateEntry(args);
  }

  return { error: 'Unhandled sandbox request' };
};

/**
 * Get list of monitoring entries
 * @returns {Object} Mock list of monitoring entries
 * 
 * @description
 * Returns a mock list of monitoring entries with sample data.
 * Used for testing and development purposes.
 */
const sandboxGetListOfEntries = () => ({
  data: [
    { id: 'mock1', name: 'Mock Model 1' },
    { id: 'mock2', name: 'Mock Model 2' },
  ],
});

/**
 * Get details for a specific monitoring entry
 * @returns {Object} Mock entry details
 * 
 * @description
 * Returns mock details for a specific monitoring entry.
 * Used for testing and development purposes.
 */
const sandboxGetEntryDetails = () => ({
  data: { id: 'mock1', details: 'Mock Entry Details' },
});

/**
 * Update a monitoring entry
 * @param {Object} args - Request arguments
 * @param {string} args.url - Request URL
 * @param {Object} args.body - Update data
 * @returns {Object} Updated entry data
 * 
 * @description
 * Updates a monitoring entry in the sandbox environment:
 * - Stores the update in sessionStorage
 * - Returns the updated data
 * Used for testing and development purposes.
 */
const sandboxUpdateEntry = (args) => {
  const sandboxData = JSON.parse(sessionStorage.getItem('sandboxData') || '{}');
  sandboxData[args.url] = args.body;
  sessionStorage.setItem('sandboxData', JSON.stringify(sandboxData));
  return { data: args.body };
};