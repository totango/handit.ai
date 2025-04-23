'use strict';
import { Model } from 'sequelize';
import { generateSummary } from '../src/services/summaryGenerationService.js';

export default (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.SummaryMessage, {
        foreignKey: 'conversationId',
        targetKey: 'conversationId'
      });
    }
  }

  Message.init({
    conversationId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'conversation_id'
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    output: {
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
    modelName: 'Message',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['conversation_id']
      }
    ],
    hooks: {
      afterCreate: async (message) => {
        try {
          // Generate summary in the background
          generateSummary(message.conversationId, sequelize.models.Message, sequelize.models.SummaryMessage).catch(error => {
            console.error('Error generating summary after message creation:', error);
          });
        } catch (error) {
          console.error('Error in afterCreate hook:', error);
        }
      }
    }
  });

  return Message;
}; 