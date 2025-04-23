'use strict';
import { Model } from 'sequelize';
import crypto from 'crypto';
export default (sequelize, DataTypes) => {
  class ApiToken extends Model {
    static associate(models) {
    }

    static async generateToken() {
      return crypto.randomBytes(32).toString('hex');
    }
  }

  ApiToken.init({
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
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
    modelName: 'ApiToken',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['token']
      }
    ]
  });

  return ApiToken;
}; 