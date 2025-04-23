'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EvaluatorMetric extends Model {
    static associate(models) {
      EvaluatorMetric.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    }
  }
  EvaluatorMetric.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    params: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isGlobal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_global',
      defaultValue: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'company_id',
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
    modelName: 'EvaluatorMetric',
    tableName: 'EvaluatorMetrics',
    timestamps: true,
    underscored: true,
  });
  return EvaluatorMetric;
}; 