'use strict';

export const up = async (queryInterface, Sequelize) => {
  // Rename agent_logs to AgentLogs
  await queryInterface.renameTable('agent_logs', 'AgentLogs');

  // Rename agent_node_logs to AgentNodeLogs
  await queryInterface.renameTable('agent_node_logs', 'AgentNodeLogs');

  // Rename tool_logs to ToolLogs
  await queryInterface.renameTable('tool_logs', 'ToolLogs');

  // Update foreign key references in AgentNodeLogs
  await queryInterface.removeConstraint('AgentNodeLogs', 'agent_node_logs_parent_log_id_fkey');
  await queryInterface.addConstraint('AgentNodeLogs', {
    fields: ['parent_log_id'],
    type: 'foreign key',
    name: 'agent_node_logs_parent_log_id_fkey',
    references: {
      table: 'AgentNodeLogs',
      field: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  // Update foreign key references in ToolLogs
  await queryInterface.removeConstraint('ToolLogs', 'tool_logs_agent_log_id_fkey');
  await queryInterface.addConstraint('ToolLogs', {
    fields: ['agent_log_id'],
    type: 'foreign key',
    name: 'tool_logs_agent_log_id_fkey',
    references: {
      table: 'AgentLogs',
      field: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Update foreign key references in ModelLogs
  await queryInterface.removeConstraint('ModelLogs', 'ModelLogs_agent_log_id_fkey');
  await queryInterface.addConstraint('ModelLogs', {
    fields: ['agent_log_id'],
    type: 'foreign key',
    name: 'ModelLogs_agent_log_id_fkey',
    references: {
      table: 'AgentLogs',
      field: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
};

export const down = async (queryInterface, Sequelize) => {
  // First remove the foreign key constraints
  await queryInterface.removeConstraint('AgentNodeLogs', 'agent_node_logs_parent_log_id_fkey');
  await queryInterface.removeConstraint('ToolLogs', 'tool_logs_agent_log_id_fkey');
  await queryInterface.removeConstraint('ModelLogs', 'ModelLogs_agent_log_id_fkey');

  // Rename tables back to snake_case
  await queryInterface.renameTable('AgentLogs', 'agent_logs');
  await queryInterface.renameTable('AgentNodeLogs', 'agent_node_logs');
  await queryInterface.renameTable('ToolLogs', 'tool_logs');

  // Restore original foreign key constraints
  await queryInterface.addConstraint('agent_node_logs', {
    fields: ['parent_log_id'],
    type: 'foreign key',
    name: 'agent_node_logs_parent_log_id_fkey',
    references: {
      table: 'agent_node_logs',
      field: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  await queryInterface.addConstraint('tool_logs', {
    fields: ['agent_log_id'],
    type: 'foreign key',
    name: 'tool_logs_agent_log_id_fkey',
    references: {
      table: 'agent_logs',
      field: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  await queryInterface.addConstraint('ModelLogs', {
    fields: ['agent_log_id'],
    type: 'foreign key',
    name: 'ModelLogs_agent_log_id_fkey',
    references: {
      table: 'agent_logs',
      field: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
}; 