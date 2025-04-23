'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.changeColumn('Models', 'name', {
    type: Sequelize.STRING,
    allowNull: false,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.changeColumn('Models', 'name', {
    type: Sequelize.FLOAT,
    allowNull: false,
  });
};
