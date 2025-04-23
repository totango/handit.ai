'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  const alerts = await queryInterface.sequelize.query('SELECT * FROM "Alerts"');
  for (let i = 0; i < alerts[0].length; i++) {
    const alert = alerts[0][i];
    if (!alert.type) {
      await queryInterface.sequelize.query(`UPDATE "Alerts" SET "type" = 'metric' WHERE "id" = ${alert.id}`);
    }
  }
};

export const down = async (queryInterface) => {
  // Add reverting commands here if needed
};
