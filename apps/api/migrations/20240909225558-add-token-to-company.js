'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('Companies', 'apiToken', {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: '',
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Companies', 'apiToken');
};
