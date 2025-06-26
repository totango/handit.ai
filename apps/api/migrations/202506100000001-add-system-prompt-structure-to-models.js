'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('Models', 'system_prompt_structure', {
    type: Sequelize.JSON,
    allowNull: true,
    comment: 'JSON field storing the detected structure for system prompt location in input data'
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Models', 'system_prompt_structure');
}; 