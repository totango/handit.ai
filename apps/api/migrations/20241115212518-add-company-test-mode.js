'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('Companies', 'test_mode', {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Companies', 'test_mode');
};
