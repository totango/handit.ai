'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ToolLog extends Model {
    static associate(models) {
      ToolLog.belongsTo(models.AgentNode, { foreignKey: 'agent_node_id' });
      ToolLog.belongsTo(models.AgentLog, { foreignKey: 'agent_log_id' });
    }
  }

  ToolLog.init({
    agentNodeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'agent_node_id'
    },
    agentLogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'agent_log_id'
    },
    input: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Input data for the tool operation'
    },
    output: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Output from the tool operation'
    },
    status: {
      type: DataTypes.ENUM('success', 'error', 'timeout'),
      allowNull: false,
      defaultValue: 'success'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duration of tool execution in milliseconds'
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional metadata about the tool execution'
    },
    errorDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'error_details',
      comment: 'Error information if status is error'
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
    modelName: 'ToolLog',
    tableName: 'ToolLogs',
    timestamps: true,
    paranoid: true
  });

  return ToolLog;
}; 