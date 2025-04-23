'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('ModelLogs', 'batch_id', {
    type: Sequelize.STRING,
    allowNull: true,
    after: 'id'
  });

  await queryInterface.addColumn('ModelLogs', 'evaluation_status', {
    type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed'),
    allowNull: true,
    defaultValue: 'pending',
    after: 'batchId'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('ModelLogs', 'evaluation_status');
  await queryInterface.removeColumn('ModelLogs', 'batch_id');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_ModelLogs_evaluationStatus;');
}; 