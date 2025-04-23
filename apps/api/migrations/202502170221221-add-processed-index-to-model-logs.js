'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addIndex('ModelLogs', ['processed'], {
    name: 'model_logs_processed_idx'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeIndex('ModelLogs', 'model_logs_processed_idx');

}; 