'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  // add phone number and title
  await queryInterface.addColumn('Users', 'phone_number', {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn('Users', 'title', {
    type: Sequelize.STRING,
    allowNull: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Users', 'phone_number');
  await queryInterface.removeColumn('Users', 'title');
};
