'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('ModelLogs', 'actual', {
    type: Sequelize.FLOAT,
    allowNull: true,
  });
  await queryInterface.addColumn('ModelLogs', 'predicted', {
    type: Sequelize.FLOAT,
    allowNull: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ModelLogs', 'actual');
  await queryInterface.removeColumn('ModelLogs', 'predicted');
};
