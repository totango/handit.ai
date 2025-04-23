'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('ModelMetricLogs', 'expected_output', {
    type: Sequelize.JSON,
    allowNull: true,
  });
  await queryInterface.addColumn('ModelMetricLogs', 'processed', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ModelMetricLogs', 'expected_output');
  await queryInterface.removeColumn('ModelMetricLogs', 'processed');
};
