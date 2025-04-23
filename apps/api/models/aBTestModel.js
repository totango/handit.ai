'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ABTestModel extends Model {
    static associate(models) {
      ABTestModel.belongsTo(models.Model, { foreignKey: 'model_id' });
      ABTestModel.belongsTo(models.Model, { foreignKey: 'optimized_model_id', as: 'OptimizedModel' });
    }
  }
  ABTestModel.init({
    optimizedModelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'optimized_model_id'
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_id'
    },
    principal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    },
    modelVersionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'model_version_id'
    },
    optimizedModelVersionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'optimized_model_version_id'
    }
  }, {
    sequelize,
    modelName: 'ABTestModels',
    timestamps: true,
    paranoid: true,
  });
  return ABTestModel;
};
