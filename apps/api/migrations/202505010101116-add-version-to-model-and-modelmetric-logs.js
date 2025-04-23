'use strict';

export const up = async (queryInterface, Sequelize) => {
  // Add version to ModelMetricLogs
  await queryInterface.addColumn('ModelMetricLogs', 'version', {
    type: Sequelize.STRING,
    allowNull: true,
    comment: 'Version of the model when the metric log was created'
  });
  await queryInterface.addIndex('ModelMetricLogs', ['version']);
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ModelMetricLogs', 'version');
}; 