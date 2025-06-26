import { detectSystemPromptStructure, updateModelSystemPromptStructure } from './systemPromptStructureDetectorService.js';

/**
 * Automatically detects and updates system prompt structure for a model
 * @param {number} modelId - The model ID
 * @param {Object} Model - The Model sequelize model
 * @param {Object} ModelLog - The ModelLog sequelize model
 * @returns {Promise<Object>} The detection result
 */
export const autoDetectAndUpdateSystemPromptStructure = async (modelId, Model, ModelLog) => {
  try {
    const model = await Model.findByPk(modelId);
    if (!model) {
      throw new Error(`Model with ID ${modelId} not found`);
    }

    // Get recent logs for the model
    const logs = await ModelLog.findAll({
      where: {
        modelId: modelId,
      },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Detect the structure
    const detectionResult = await detectSystemPromptStructure(logs, model);
    
    if (detectionResult.structure && detectionResult.confidence > 0.7) {
      // Update the model with the detected structure
      await updateModelSystemPromptStructure(model, detectionResult);
      
      return {
        success: true,
        message: 'System prompt structure detected and updated',
        structure: detectionResult.structure,
        confidence: detectionResult.confidence,
        reasoning: detectionResult.reasoning,
        logsCount: logs.length
      };
    } else {
      return {
        success: false,
        message: 'No reliable structure detected',
        confidence: detectionResult.confidence,
        reasoning: detectionResult.reasoning,
        logsCount: logs.length
      };
    }

  } catch (error) {
    console.error('Error in autoDetectAndUpdateSystemPromptStructure:', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
      error: error
    };
  }
};
