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
  });
  return ModelEvaluationPrompt;
}; 