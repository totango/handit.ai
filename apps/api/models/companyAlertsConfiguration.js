'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class CompanyAlertsConfiguration extends Model {
    static associate(models) {
      // Define associations here
      CompanyAlertsConfiguration.belongsTo(models.ModelMetric, { foreignKey: 'model_metric_id' });
    }
  }
  CompanyAlertsConfiguration.init({
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'company_id'
    },
    alertType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'alert_type'
    },
    alertThreshold: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'alert_threshold'
    },
    comparingOperator: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'comparing_operator'
    },
    modelMetricId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'model_metric_id'
    },
    alertSeverity: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'alert_severity'
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
    modelName: 'CompanyAlertsConfiguration',
    timestamps: true,
    paranoid: true,
  });
  return CompanyAlertsConfiguration;
};
