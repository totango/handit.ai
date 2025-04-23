'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addIndex('AgentNodeLogs', 
    ['agent_node_id', 'created_at'], {
      name: 'idx_agent_node_logs_node_date'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeIndex('AgentNodeLogs', 'idx_agent_node_logs_node_date');
}; 
