'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class DatasetGroup extends Model {
    static associate(models) {
      DatasetGroup.belongsTo(models.Company, { foreignKey: 'company_id' });
      DatasetGroup.hasMany(models.Dataset, { foreignKey: 'dataset_group_id', as: 'datasets' });
    }
  }
  DatasetGroup.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
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
    modelName: 'DatasetGroup',
    timestamps: true,
    paranoid: true,
  });
  return DatasetGroup;
};
