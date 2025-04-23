'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class InsightsModels extends Model {
    static associate(models) {
      InsightsModels.belongsTo(models.Model, { foreignKey: 'model_id' });
      InsightsModels.belongsTo(models.Model, { foreignKey: 'insight_model_id' });
    }
  }
  InsightsModels.init({
    insightModelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'insight_model_id'
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_id'
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'InsightsModels',
    timestamps: true,
    paranoid: true,
  });
  return InsightsModels;
};
