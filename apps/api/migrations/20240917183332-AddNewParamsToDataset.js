'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('Datasets', 'type', {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn('Datasets', 'version', {
    type: Sequelize.STRING,
    allowNull: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Datasets', 'type');
  await queryInterface.removeColumn('Datasets', 'version');
};
