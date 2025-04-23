'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ModelDataset extends Model {
    static associate(models) {
      // Define associations here
      ModelDataset.belongsTo(models.Model, { foreignKey: 'model_id' });
      ModelDataset.belongsTo(models.Dataset, { foreignKey: 'dataset_id' });
    }
  }
  ModelDataset.init({
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    },
  }, {
    sequelize,
    modelName: 'ModelDataset',
    timestamps: true,
    paranoid: true,
  });
  return ModelDataset;
};
