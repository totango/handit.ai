'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Insights extends Model {
    static associate(models) {
      Insights.belongsTo(models.Model, { foreignKey: 'model_id' });
    }
  }
  Insights.init({
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_id'
    },
    problem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    solution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
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
    version: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Version of the model when the insight was created'
    }
  }, {
    sequelize,
    modelName: 'Insights',
    timestamps: true,
    paranoid: true,
  });
  return Insights;
};
