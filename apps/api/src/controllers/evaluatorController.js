import { 
  createEvaluatorTrainingJob, 
  checkTrainingStatus,
  createEvaluatorModel 
} from '../services/evaluatorTrainingService.js';

export const startEvaluatorTraining = async (req, res) => {
  try {
    const modelId = req.params.modelId;
    const jobId = await createEvaluatorTrainingJob(modelId, req.app.get('sequelize'));
    
    res.status(200).json({
      message: 'Evaluator training started',
      jobId,
      status: 'pending'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTrainingStatus = async (req, res) => {
  try {
    const status = await checkTrainingStatus(req.params.modelId);
    res.status(200).json(status);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const completeEvaluatorSetup = async (req, res) => {
  try {
    const { modelId } = req.params;
    const { fineTunedModelId } = req.body;
    const evaluatorModel = await createEvaluatorModel(
      modelId, 
      fineTunedModelId, 
      req.app.get('sequelize')
    );

    res.status(201).json({
      message: 'Evaluator model created successfully',
      evaluatorModel
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 