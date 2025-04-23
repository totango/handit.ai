'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AnalyticsLog extends Model {
    static associate(models) {
      AnalyticsLog.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  AnalyticsLog.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'event_name',
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'event_count',
    },
    activeUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'active_users',
    },
    sessions: {
      type: DataTypes.INTEGER,
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
  }, {
    sequelize,
    modelName: 'AnalyticsLog',
    timestamps: true,
    paranoid: true,
  });
  return AnalyticsLog;
};
