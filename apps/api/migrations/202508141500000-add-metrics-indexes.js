'use strict';

export const up = async (queryInterface, Sequelize) => {
    // Add indexes for tool metrics queries
    await queryInterface.addIndex('AgentNodeLogs', {
      fields: ['agent_node_id', 'status', 'created_at'],
      name: 'agent_node_logs_node_status_created_idx',
      concurrently: true
    });

    // Add index for model metrics queries - AgentNodes by type
    await queryInterface.addIndex('AgentNodes', {
      fields: ['agent_id', 'type'],
      name: 'agent_nodes_agent_type_idx',
      concurrently: true
    });

    // Add index for ModelMetricLogs queries
    await queryInterface.addIndex('ModelMetricLogs', {
      fields: ['model_metric_id', 'created_at'],
      name: 'model_metric_logs_metric_created_idx',
      concurrently: true
    });

    // Add composite index for ModelMetrics
    await queryInterface.addIndex('ModelMetrics', {
      fields: ['model_id', 'name'],
      name: 'model_metrics_model_name_idx',
      concurrently: true
    });

    // Add index for AgentNodeLogs created_at for date range queries
    await queryInterface.addIndex('AgentNodeLogs', {
      fields: ['created_at'],
      name: 'agent_node_logs_created_idx',
      concurrently: true
    });

    // Add index for ModelMetricLogs value queries
    await queryInterface.addIndex('ModelMetricLogs', {
      fields: ['model_metric_id', 'value'],
      name: 'model_metric_logs_metric_value_idx',
      concurrently: true
    });
};

export const down = async (queryInterface, Sequelize) => {
    // Remove indexes in reverse order
    await queryInterface.removeIndex('ModelMetricLogs', 'model_metric_logs_metric_value_idx');
    await queryInterface.removeIndex('AgentNodeLogs', 'agent_node_logs_created_idx');
    await queryInterface.removeIndex('ModelMetrics', 'model_metrics_model_name_idx');
    await queryInterface.removeIndex('ModelMetricLogs', 'model_metric_logs_metric_created_idx');
    await queryInterface.removeIndex('AgentNodes', 'agent_nodes_agent_type_idx');
    await queryInterface.removeIndex('AgentNodeLogs', 'agent_node_logs_node_status_created_idx');
};