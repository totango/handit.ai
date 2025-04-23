'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  // Model Logs Indexes
  await queryInterface.addColumn('Models', 'active', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Models', 'active');
}; 