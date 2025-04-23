'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class CompanyMetric extends Model {
    static associate(models) {
      // Define associations here
      CompanyMetric.belongsTo(models.Company, { foreignKey: 'company_id' });
    }

    async createCompanyMetricLog({value}) {
      const CompanyMetricLog = sequelize.models.CompanyMetricLog;
      return CompanyMetricLog.create({
        value,
        companyMetricId: this.id,
        label: this.name,
        description: this.description
      });
    }
  }
  CompanyMetric.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parameters: {
      type: DataTypes.JSON,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    targetDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'target_date'
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'company_id'
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
    modelName: 'CompanyMetric',
    timestamps: true,
    paranoid: true,
  });
  return CompanyMetric;
};
