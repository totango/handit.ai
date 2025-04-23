'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('AgentLogs', 'summary', {
    type: Sequelize.TEXT,
    allowNull: true,
    after: 'agent_id'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('AgentLogs', 'summary');
}; 