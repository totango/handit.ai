'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('Models', 'slug', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Models', 'slug');
};
