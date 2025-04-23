'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('ModelLogs', 'metric_processed', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ModelLogs', 'metric_processed');
};
