import { checkAllPendingBatches } from "../services/evaluationService.js";
import db from "../../models/index.js";

const { ModelLog } = db;

export const checkBatchStatusController = async (req, res) => {
  try {
    const status = await checkAllPendingBatches(ModelLog);
    
    res.status(200).json(status);
  } catch (error) {
    console.error('Error checking batch status:', error);
    res.status(500).json({ error: error.message });
  }
};
