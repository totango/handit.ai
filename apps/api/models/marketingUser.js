'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MarketingUser extends Model {
    static associate(models) {}
  }
  MarketingUser.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
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
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      modelName: 'MarketingUser',
      timestamps: true,
      paranoid: true,
      hooks: {},
    }
  );
  return MarketingUser;
};
