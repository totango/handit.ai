'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {
      // Associate Membership with User
      Membership.hasMany(models.User, { foreignKey: 'membershipId' });
    }
  }

  Membership.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    limits: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    modelName: 'Membership',
    timestamps: true,
  });

  return Membership;
};
