'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Dataset extends Model {
    static associate(models) {
      Dataset.belongsTo(models.DatasetGroup, { foreignKey: 'dataset_group_id' });
      Dataset.belongsToMany(models.Model, {
        through: models.ModelDataset,
        foreignKey: 'dataset_id',
        otherKey: 'model_id',
        as: 'models',
      });
    }
  }
  Dataset.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    datasetCreationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'dataset_creation_date'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    datasetGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'dataset_group_id'
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
    modelName: 'Dataset',
    timestamps: true,
    paranoid: true,
  });
  return Dataset;
};
