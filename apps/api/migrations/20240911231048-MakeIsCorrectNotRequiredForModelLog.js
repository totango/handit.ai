'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.changeColumn('ModelLogs', 'is_correct', {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'is_correct',
  });
};

export const down = async (queryInterface) => {
  await queryInterface.changeColumn('ModelLogs', 'is_correct', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    field: 'is_correct',
  });
};
