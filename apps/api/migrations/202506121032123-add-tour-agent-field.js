'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  // Check if column already exists
  const tableDescription = await queryInterface.describeTable('Agents');
  if (!tableDescription.tour_agent) {
    await queryInterface.addColumn('Agents', 'tour_agent', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Flag to indicate if agent is a tour/demo agent for onboarding'
    });
  }
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Agents', 'tour_agent');
}; 