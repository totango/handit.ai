'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('ModelLogs', 'status', {
    type: Sequelize.ENUM('success', 'error'),
    defaultValue: 'success',
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('ModelLogs', 'status');
}; 
