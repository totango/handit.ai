'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ModelEvaluationPrompt extends Model {
    static associate(models) {
      ModelEvaluationPrompt.belongsTo(models.Model, { foreignKey: 'modelId', as: 'model' });
      ModelEvaluationPrompt.belongsTo(models.EvaluationPrompt, { foreignKey: 'evaluationPromptId', as: 'evaluationPrompt' });
      ModelEvaluationPrompt.belongsTo(models.IntegrationToken, { foreignKey: 'integrationTokenId', as: 'integrationToken' });
    }
  }
  ModelEvaluationPrompt.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_id',
    },
    evaluationPromptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'evaluation_prompt_id',
    },
    integrationTokenId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'integration_token_id',
    },
    providerModel: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'provider_model',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  }, {
    sequelize,
    modelName: 'ModelEvaluationPrompt',
    tableName: 'ModelEvaluationPrompts',
    timestamps: true,
    underscored: true,
    hooks: {
      afterCreate: async (modelEvaluationPrompt) => {
        const promptId = modelEvaluationPrompt.evaluationPromptId;
        const prompt = await sequelize.models.EvaluationPrompt.findByPk(promptId);

        const modelMetric = await sequelize.models.ModelMetric.findOne({
          where: {
            modelId: modelEvaluationPrompt.modelId,
            name: prompt.name,
          },
        });

        if (!modelMetric) {
        await sequelize.models.ModelMetric.create({
          modelId: modelEvaluationPrompt.modelId,
          name: prompt.name,
          type: 'oss',
          label: prompt.name,
            description: prompt.name,
            threshold: 1,
          });
        }

        const abTests = await sequelize.models.ABTestModels.findAll({
          where: {
            modelId: modelEvaluationPrompt.modelId,
          },
        });
        
        for (let i = 0; i < abTests.length; i++) {
          const abTest = abTests[i];
          const modelMetric = await sequelize.models.ModelMetric.findOne({
            where: {
              modelId: abTest.optimizedModelId,
              name: prompt.name,
            },
          });

          if (!modelMetric) {
            await sequelize.models.ModelMetric.create({
              modelId: abTest.optimizedModelId,
              name: prompt.name,
              type: 'oss',
              label: prompt.name,
              description: prompt.name,
              threshold: 1,
            });
          }
        }
      }
    }
  });
  return ModelEvaluationPrompt;
}; 