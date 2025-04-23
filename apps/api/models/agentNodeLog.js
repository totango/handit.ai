'use strict';
import { Model } from 'sequelize';
import { sendToolErrorNotification } from '../src/services/emailService.js';

export default (sequelize, DataTypes) => {
  class AgentNodeLog extends Model {
    static associate(models) {
      AgentNodeLog.belongsTo(models.AgentNode, { foreignKey: 'agent_node_id' });
      AgentNodeLog.belongsTo(models.Agent, { foreignKey: 'agent_id' });
    }
  }

  AgentNodeLog.init({
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'agent_id'
    },
    agentNodeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'agent_node_id'
    },
    input: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Input data for the tool/node operation'
    },
    output: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Output/response from the tool/node operation'
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional metadata about the operation (headers, configs, etc)'
    },
    operationType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'operation_type',
      comment: 'Type of operation (http_call, rag_query, function_call, etc)'
    },
    status: {
      type: DataTypes.ENUM('success', 'error', 'timeout'),
      allowNull: false,
      defaultValue: 'success'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duration of the operation in milliseconds'
    },
    errorDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'error_details',
      comment: 'Detailed error information if status is error'
    },
    processed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this log has been processed for metrics/analytics'
    },
    metricProcessed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'metric_processed',
      comment: 'Whether metrics have been calculated for this log'
    },
    parentLogId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'parent_log_id',
      comment: 'ID of the parent log in a chain of operations'
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
    modelName: 'AgentNodeLog',
    tableName: 'AgentNodeLogs',
    timestamps: true,
    paranoid: true,
    hooks: {
      afterCreate: async (agentNodeLog, options) => {
        setImmediate(async () => {
          try {
            const agentNode = await sequelize.models.AgentNode.findByPk(
              agentNodeLog.agentNodeId,
              {
                include: [{ model: sequelize.models.Agent }]
              }
            );

            if (!agentNode || !agentNode.Agent.active) {
              return;
            }

            // Check for errors in the operation
            if (agentNodeLog.status === 'error') {
              await sequelize.models.Alert.create({
                type: 'error',
                severity: 'high',
                message: 'Tool operation failed',
                data: agentNodeLog.errorDetails,
                agentId: agentNodeLog.agentId,
                agentNodeId: agentNodeLog.agentNodeId
              });

              // Send tool error notification
              await sendToolErrorNotification(
                agentNodeLog,
                sequelize.models.Agent,
                sequelize.models.AgentNode,
                sequelize.models.Company,
                sequelize.models.Email,
                sequelize.models.User
              );
            }

            // Calculate and update metrics
            if (!agentNodeLog.metricProcessed) {
              const metrics = await calculateNodeMetrics(agentNodeLog);
              await updateNodeMetrics(agentNode, metrics);
              await agentNodeLog.update({ metricProcessed: true });
            }

            // Handle tool-specific processing
            if (agentNode.type === 'tool') {
              await processToolSpecificMetrics(agentNode, agentNodeLog);
            }

            // Update agent entry flow cache
            if (agentNodeLog.parentLogId) {
             //const { updateAgentEntryFlowCache } = await import('../src/services/agentService.js');
              //await updateAgentEntryFlowCache(agentNodeLog.parentLogId);
            }
          } catch (error) {
            console.error('Error in AgentNodeLog afterCreate hook:', error);
          }
        });
      },
      afterUpdate: async (agentNodeLog, options) => {
        setImmediate(async () => {
          try {
            // Check if status was updated to error
            if (agentNodeLog.changed('status') && agentNodeLog.status === 'error') {
              const agentNode = await sequelize.models.AgentNode.findByPk(
                agentNodeLog.agentNodeId,
                {
                  include: [{ model: sequelize.models.Agent }]
                }
              );

              if (!agentNode || !agentNode.Agent.active) {
                return;
              }

              await sequelize.models.Alert.create({
                type: 'error',
                severity: 'high',
                message: 'Tool operation failed',
                data: agentNodeLog.errorDetails,
                agentId: agentNodeLog.agentId,
                agentNodeId: agentNodeLog.agentNodeId
              });

              // Send tool error notification
              await sendToolErrorNotification(
                agentNodeLog,
                sequelize.models.Agent,
                sequelize.models.AgentNode,
                sequelize.models.Company,
                sequelize.models.Email,
                sequelize.models.User
              );
            }

            // Update agent entry flow cache
            if (agentNodeLog.parentLogId) {
              //const { updateAgentEntryFlowCache } = await import('../src/services/agentService.js');
              //await updateAgentEntryFlowCache(agentNodeLog.parentLogId);
            }
          } catch (error) {
            console.error('Error in AgentNodeLog afterUpdate hook:', error);
          }
        });
      }
    }
  });

  return AgentNodeLog;
};

// Helper functions for the hooks
async function calculateNodeMetrics(log) {
  const metrics = {
    duration: log.duration,
    status: log.status,
    timestamp: log.createdAt
  };

  // Add tool-specific metrics based on operation type
  switch (log.operationType) {
    case 'http_call':
      metrics.responseTime = log.duration;
      metrics.statusCode = log.metadata?.statusCode;
      break;
    case 'rag_query':
      metrics.retrievalTime = log.metadata?.retrievalTime;
      metrics.documentsRetrieved = log.metadata?.documentsCount;
      break;
    // Add more operation types as needed
  }

  return metrics;
}

async function updateNodeMetrics(agentNode, metrics) {
  // Update or create metrics for the node
  const nodeMetric = await sequelize.models.AgentNodeMetric.findOne({
    where: {
      agentNodeId: agentNode.id,
      type: metrics.status === 'error' ? 'error_rate' : 'performance'
    }
  });

  if (nodeMetric) {
    await nodeMetric.createLog({
      value: metrics.status === 'error' ? 1 : 0,
      metadata: metrics
    });
  }
}

async function processToolSpecificMetrics(agentNode, log) {
  // Process specific metrics based on tool type
  //const toolConfig = agentNode.config;
  
  /*switch (toolConfig.type) {
    case 'api':
      await processApiMetrics(agentNode, log);
      break;
    case 'database':
      await processDatabaseMetrics(agentNode, log);
      break;
    // Add more tool types as needed
  }*/
} 