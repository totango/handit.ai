'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class CompanyMetricLog extends Model {
    static associate(models) {
      // Define associations here
      CompanyMetricLog.belongsTo(models.CompanyMetric, { foreignKey: 'company_metric_id' });
    }
  }
  CompanyMetricLog.init({
    value: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyMetricId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'company_metric_id'
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
    modelName: 'CompanyMetricLog',
    timestamps: true,
    paranoid: true,
  });
  return CompanyMetricLog;
};
