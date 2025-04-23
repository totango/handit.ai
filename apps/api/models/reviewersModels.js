'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ReviewersModels extends Model {
    static associate(models) {
      // Define associations here
      ReviewersModels.belongsTo(models.Model, { foreignKey: 'model_id' });
      ReviewersModels.belongsTo(models.Model, { foreignKey: 'reviewer_id' });
    }
  }
  ReviewersModels.init({
    reviewerId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: 'reviewer_id'
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_id'
    },
    activationThreshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
      field: 'activation_threshold'
    },
    evaluationPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      field: 'evaluation_percentage'
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
    modelName: 'ReviewersModels',
    timestamps: true,
    paranoid: true,
  });
  return ReviewersModels;
};
