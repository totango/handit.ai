'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class CompanyTresholdModel extends Model {
    static associate(models) {
      // Define associations here
      CompanyTresholdModel.belongsTo(models.Company, { foreignKey: 'company_id' });
    }
  }
  CompanyTresholdModel.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.DOUBLE,
      allowNull: false
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
    modelName: 'CompanyTreshold',
    timestamps: true,
    paranoid: true,
  });
  return CompanyTresholdModel;
};
