'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EvaluationLog extends Model {
    static associate(models) {
      EvaluationLog.belongsTo(models.ModelLog, { foreignKey: 'modelLogId', as: 'modelLog' });
      EvaluationLog.belongsTo(models.EvaluationPrompt, { foreignKey: 'evaluationPromptId', as: 'evaluationPrompt' });
      EvaluationLog.belongsTo(models.Model, { foreignKey: 'modelId', as: 'model' });
    }
  }
  EvaluationLog.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    modelLogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_log_id',
    },
    evaluationPromptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'evaluation_prompt_id',
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_id',
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_correct',
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
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
    modelName: 'EvaluationLog',
    tableName: 'EvaluationLogs',
    timestamps: true,
    underscored: true,
  });
  return EvaluationLog;
}; 