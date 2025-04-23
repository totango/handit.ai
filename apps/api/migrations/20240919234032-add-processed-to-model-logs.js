'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.removeColumn('ModelMetricLogs', 'expected_output');
  await queryInterface.removeColumn('ModelMetricLogs', 'processed');

  await queryInterface.addColumn('ModelLogs', 'processed', {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ModelLogs', 'processed');
};
