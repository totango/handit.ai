'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Email extends Model {
    static associate(models) {
      // Define associations here if needed
      // Example:
      // Email.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Email.init({
    to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notificationSource: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'notification_source',
      comment: 'Source of the notification (e.g., agent_node, model_log)'
    },
    sourceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'source_id',
      comment: 'ID of the source (e.g., agent_node_id, model_log_id)'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
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
    modelName: 'Email',
    timestamps: true,
    paranoid: true,
  });
  return Email;
};
