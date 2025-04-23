'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  // change predicted vs actual to JSON and not integer
  await queryInterface.removeColumn('ModelLogs', 'actual');
  await queryInterface.removeColumn('ModelLogs', 'predicted');
  await queryInterface.addColumn('ModelLogs', 'actual', {
    type: Sequelize.JSON,
    allowNull: true,
  });
  await queryInterface.addColumn('ModelLogs', 'predicted', {
    type: Sequelize.JSON,
    allowNull: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ModelLogs', 'actual');
  await queryInterface.removeColumn('ModelLogs', 'predicted');
  await queryInterface.addColumn('ModelLogs', 'actual', {
    type: Sequelize.INTEGER,
    allowNull: true,
  });
  await queryInterface.addColumn('ModelLogs', 'predicted', {
    type: Sequelize.INTEGER,
    allowNull: true,
  });
};
