const { ApiToken } = require('../models');

class ApiTokenService {
  static async generateToken(companyId) {
    const token = await ApiToken.generateToken();
    return await ApiToken.create({
      token,
      companyId
    });
  }

  static async validateToken(token) {
    if (!token) {
      return false;
    }

    const apiToken = await ApiToken.findOne({
      where: {
        token,
        isActive: true
      }
    });

    return !!apiToken;
  }

  static async revokeToken(token) {
    const apiToken = await ApiToken.findOne({
      where: {
        token,
        isActive: true
      }
    });

    if (!apiToken) {
      throw new Error('API token not found');
    }

    apiToken.isActive = false;
    await apiToken.save();
  }

  static async getActiveTokens(companyId) {
    return await ApiToken.findAll({
      where: {
        companyId,
        isActive: true
      }
    });
  }
}

module.exports = ApiTokenService; 