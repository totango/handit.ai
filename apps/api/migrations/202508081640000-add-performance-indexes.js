'use strict';

export const up = async (queryInterface, Sequelize) => {
    // Add composite indexes for AgentLogs performance
    await queryInterface.addIndex('AgentLogs', {
      fields: ['agent_id', 'environment', 'created_at'],
      name: 'agent_logs_agent_env_created_idx',
      concurrently: true
    });

    await queryInterface.addIndex('AgentLogs', {
      fields: ['agent_id', 'environment', 'status'],
      name: 'agent_logs_agent_env_status_idx',
      concurrently: true
    });

    // Add index for AgentNodeLogs parent lookup
    await queryInterface.addIndex('AgentNodeLogs', {
      fields: ['parent_log_id', 'status'],
      name: 'agent_node_logs_parent_status_idx',
      concurrently: true
    });

    // Add index for ModelLogs agent log lookup
    await queryInterface.addIndex('ModelLogs', {
      fields: ['agent_log_id', 'status'],
      name: 'model_logs_agent_log_status_idx',
      concurrently: true
    });

    // Add index for ModelLogs model lookup (for JOINs)
    await queryInterface.addIndex('ModelLogs', {
      fields: ['model_id', 'status'],
      name: 'model_logs_model_status_idx',
      concurrently: true
    });

    // Add index for AgentNodes for better JOIN performance
    await queryInterface.addIndex('AgentNodes', {
      fields: ['agent_id', 'model_id'],
      name: 'agent_nodes_agent_model_idx',
      concurrently: true
    });
};

export const down = async (queryInterface, Sequelize) => {
    // Remove indexes in reverse order
    await queryInterface.removeIndex('AgentNodes', 'agent_nodes_agent_model_idx');
    await queryInterface.removeIndex('ModelLogs', 'model_logs_model_status_idx');
    await queryInterface.removeIndex('ModelLogs', 'model_logs_agent_log_status_idx');
    await queryInterface.removeIndex('AgentNodeLogs', 'agent_node_logs_parent_status_idx');
    await queryInterface.removeIndex('AgentLogs', 'agent_logs_agent_env_status_idx');
    await queryInterface.removeIndex('AgentLogs', 'agent_logs_agent_env_created_idx');
};