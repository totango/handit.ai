import db from '../../models/index.js';

export const createIntegrationToken = async (req, res) => {
  try {
    const companyId = req.userObject?.companyId || req.company?.id;
    if (!companyId) return res.status(400).json({ error: 'Missing companyId' });
    const { providerId, name, type, token, secret, data, expiresAt } = req.body;
    if (!providerId || !token) {
      return res.status(400).json({ error: 'providerId, type, and token are required' });
    }

    const integrationToken = await db.IntegrationToken.create({
      companyId,
      providerId,
      name,
      type: 'token',
      token,
    });
    res.status(201).json(integrationToken);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateIntegrationToken = async (req, res) => {
  try {
    const companyId = req.userObject?.companyId || req.company?.id;
    if (!companyId) return res.status(400).json({ error: 'Missing companyId' });
    const { id } = req.params;
    const integrationToken = await db.IntegrationToken.findOne({ where: { id, companyId } });
    if (!integrationToken) return res.status(404).json({ error: 'Token not found' });
    const { providerId, name, type, token, secret, data, expiresAt } = req.body;
    await integrationToken.update({ providerId, name, type, token, secret, data, expiresAt });
    res.json(integrationToken);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getIntegrationTokens = async (req, res) => {
  try {
    const companyId = req.userObject?.companyId || req.company?.id;
    if (!companyId) return res.status(400).json({ error: 'Missing companyId' });
    const tokens = await db.IntegrationToken.findAll({
      where: { companyId },
      include: [{ model: db.Provider, as: 'provider' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const setOptimizationToken = async (req, res) => {
  try {
    const companyId = req.userObject?.companyId || req.company?.id;
    if (!companyId) return res.status(400).json({ error: 'Missing companyId' });
    const { tokenId } = req.body;
    if (!tokenId) return res.status(400).json({ error: 'Missing tokenId' });
    // Check that the token belongs to the company
    const token = await db.IntegrationToken.findOne({ where: { id: tokenId, companyId } });
    if (!token) return res.status(404).json({ error: 'Token not found or not owned by company' });
    // Update company
    const company = await db.Company.findByPk(companyId);
    company.optimizationTokenId = tokenId;
    await company.save();
    res.json({ success: true, company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 