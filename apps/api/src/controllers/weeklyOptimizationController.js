import db from '../../models/index.js';


const { Model, ModelMetric, ReviewersModels, ABTestModels } = db;

const generateInsightsForModel = async (modelId) => {
  const model = await Model.findByPk(modelId);
  await model.generateInsights();
};

const applySuggestionsToModel = async (modelId) => {
  const model = await Model.findByPk(modelId);

  if (!model) {
    throw new Error('Model not found');
  }


  const newPrompt = await model.applySuggestions();
  return newPrompt;
};

export const runWeeklyOptimization = async (req, res) => {
  try {
    // Get all active models that are not reviewers or optimized
    const models = await Model.findAll({
      where: {
        active: true,
        isReviewer: false,
        isOptimized: false,
      }
    });

    const results = [];

    for (const model of models) {
      try {
        // Step 1: Generate insights for the model
        const ab = await model.getPrincipalABTestModel();
        if (ab) {
          await generateInsightsForModel(ab.dataValues.id);
        } else {
          await generateInsightsForModel(model.id);
        }

        // Step 2: Apply suggestions to get new prompt
        let newPrompt;
        if (ab) {
          newPrompt = await applySuggestionsToModel(ab.dataValues.id);
        } else {
          newPrompt = await applySuggestionsToModel(model.id);
        }

        if (newPrompt) {
          // Step 3: Check if there's an existing AB test
          const existingABTest = await ABTestModels.findOne({
            where: {
              modelId: model.id,
              principal: true
            }
          });

          if (existingABTest) {
            console.log('existingABTest', existingABTest);
            // Update the optimized model version
            await model.updateOptimizedPrompt(newPrompt);
          } else {
            // Create a new optimized model
            const originalModel = model.toJSON();
            // remove id from originalModel
            delete originalModel.id;
            const optimizedModel = await Model.create({
              ...originalModel,
              slug: `${model.slug}-optimized-${Date.now()}`,
              isOptimized: true,
              parameters: {
                prompt: newPrompt,
                problemType: model.parameters?.problemType
              },
              problemType: model.problemType,
            });

            // Copy metrics and reviewers
            const metrics = await model.getModelMetrics();
            for (const metric of metrics) {
              await ModelMetric.create({
                ...metric.toJSON(),
                id: undefined,
                modelId: optimizedModel.id
              });
            }

            const reviewers = await model.getReviewers();
            for (const reviewer of reviewers) {
              await ReviewersModels.create({
                modelId: optimizedModel.id,
                model_id: model.id,
                reviewer_id: reviewer.reviewerId,
                reviewerId: reviewer.reviewerId
              });
            }

            // Create AB test
            await ABTestModels.create({
              modelId: model.id,
              optimizedModelId: optimizedModel.id,
              principal: true,
              percentage: 30
            });
          }

          results.push({
            modelId: model.id,
            modelName: model.name,
            status: 'success',
            newPrompt
          });
        }
      } catch (error) {
        console.error(`Error processing model ${model.id}:`, error);
        results.push({
          modelId: model.id,
          modelName: model.name,
          status: 'error',
          error: error.message
        });
      }
    }

    res.json({
      message: 'Weekly optimization completed',
      results
    });
  } catch (error) {
    console.error('Error in weekly optimization:', error);
    res.status(500).json({
      error: error.message
    });
  }
}; 