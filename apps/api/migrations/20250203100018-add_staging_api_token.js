'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Companies', 'staging_api_token', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  // Add environment column to logs tables
  await queryInterface.addColumn('AgentLogs', 'environment', {
    type: Sequelize.ENUM('production', 'staging'),
    allowNull: false,
    defaultValue: 'production'
  });

  await queryInterface.addColumn('ModelLogs', 'environment', {
    type: Sequelize.ENUM('production', 'staging'),
    allowNull: false,
    defaultValue: 'production'
  });

  await queryInterface.addColumn('AgentNodeLogs', 'environment', {
    type: Sequelize.ENUM('production', 'staging'),
    allowNull: false,
    defaultValue: 'production'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Companies', 'staging_api_token');
    await queryInterface.removeColumn('AgentLogs', 'environment');
    await queryInterface.removeColumn('ModelLogs', 'environment');
    await queryInterface.removeColumn('NodeEntryLogs', 'environment');
};