import db from '../../models/index.js';
const { ApiToken } = db;

const validateApiToken = async (req, res, next) => {
  try {
    const token = req.headers['x-api-key'];
    if (!token) {
      return res.status(401).json({ error: 'API token is required' });
    }

    const apiToken = await ApiToken.findOne({
      where: {
        token,
        isActive: true
      }
    });

    if (!apiToken) {
      return res.status(401).json({ error: 'Invalid or expired API token' });
    }

    next();
  } catch (error) {
    console.error('Error validating API token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default validateApiToken; 