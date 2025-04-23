'use strict';
import { Model as ModelEntity } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ModelDeployHistory extends ModelEntity {
    static associate(models) {
      ModelDeployHistory.belongsTo(models.Model, { foreignKey: 'modelId' });
    }
  }

  ModelDeployHistory.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Models',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'model_id',
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Version of the model deployed',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'ModelDeployHistory',
    timestamps: true,
    tableName: 'ModelDeployHistories',
  });

  return ModelDeployHistory;
}; 