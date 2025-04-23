'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('AgentLogs', 'external_id', {
    type: Sequelize.STRING,
    allowNull: true,
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('AgentLogs', 'external_id');
}; 
