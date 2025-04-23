'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('Alerts', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('Companies', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('CompanyMetricLogs', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('CompanyMetricModels', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('CompanyMetrics', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('DatasetGroups', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('Datasets', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('ModelDatasets', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('ModelGroups', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('ModelLogs', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('ModelMetricLogs', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('ModelMetrics', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('Models', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.addColumn('Users', 'deletedAt', {
    type: Sequelize.DATE,
    allowNull: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Alerts', 'deletedAt');
  await queryInterface.removeColumn('Companies', 'deletedAt');
  await queryInterface.removeColumn('CompanyMetricLogs', 'deletedAt');
  await queryInterface.removeColumn('CompanyMetricModels', 'deletedAt');
  await queryInterface.removeColumn('CompanyMetrics', 'deletedAt');
  await queryInterface.removeColumn('DatasetGroups', 'deletedAt');
  await queryInterface.removeColumn('Datasets', 'deletedAt');
  await queryInterface.removeColumn('ModelDatasets', 'deletedAt');
  await queryInterface.removeColumn('ModelGroups', 'deletedAt');
  await queryInterface.removeColumn('ModelLogs', 'deletedAt');
  await queryInterface.removeColumn('ModelMetricLogs', 'deletedAt');
  await queryInterface.removeColumn('ModelMetrics', 'deletedAt');
  await queryInterface.removeColumn('Models', 'deletedAt');
  await queryInterface.removeColumn('Users', 'deletedAt');
};
