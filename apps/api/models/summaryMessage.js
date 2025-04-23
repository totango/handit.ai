'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SummaryMessage extends Model {
    static associate(models) {
    }
  }

  SummaryMessage.init({
    conversationId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'conversation_id'
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
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
    modelName: 'SummaryMessage',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['conversation_id']
      }
    ]
  });

  return SummaryMessage;
}; 