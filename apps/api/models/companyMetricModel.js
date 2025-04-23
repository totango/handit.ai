'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class CompanyMetricModel extends Model {
    static associate(models) {
      // Define associations here
      CompanyMetricModel.belongsTo(models.CompanyMetric, { foreignKey: 'company_metric_id' });
      CompanyMetricModel.belongsTo(models.Model, { foreignKey: 'model_id' });
    }
  }
  CompanyMetricModel.init({}, {
    sequelize,
    modelName: 'CompanyMetricModel',
    timestamps: true,
    paranoid: true,
  });
  return CompanyMetricModel;
};
