import axios from 'axios';

const HANDIT_SASS_URL = process.env.HANDIT_SASS_URL;
const HANDIT_CLOUD_ENABLED = process.env.HANDIT_CLOUD_ENABLED === 'true';

/**
 * Checks if the user's action is allowed by their plan via Handit SASS.
 * @param {Object} params
 * @param {Object} params.user - The user object
 * @param {string} params.token - The user's token
 * @param {string} params.endpoint - The API endpoint being accessed
 * @param {string} params.method - The HTTP method (GET, POST, etc.)
 * @param {string} params.actionKey - A key representing the action
 * @returns {Promise<void>} Throws error if not allowed
 */
export const checkMembership = async ({ user, token, endpoint, method, actionKey }) => {
  if (!HANDIT_CLOUD_ENABLED) {
    return;
  }
  if (!HANDIT_SASS_URL) {
    throw new Error('HANDIT_SASS_URL is not set');
  }

  const response = await axios.post(HANDIT_SASS_URL, {
    user,
    token,
    endpoint,
    method,
    actionKey,
  });
  if (!response.data.allowed) {
    throw new Error(response.data.message || 'Action not allowed by plan');
  }
}