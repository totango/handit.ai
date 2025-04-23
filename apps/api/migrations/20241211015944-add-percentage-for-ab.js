'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('ABTestModels', 'percentage', {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 100,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ABTestModels', 'percentage');
};
