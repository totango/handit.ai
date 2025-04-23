import db from '../../models/index.js';
const { Provider } = db;

export async function getProviders(req, res) {
  try {
    const providers = await Provider.findAll();
    return res.json({ success: true, data: providers });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
