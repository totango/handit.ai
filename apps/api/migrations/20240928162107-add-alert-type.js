'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('Alerts', 'type', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  // rename notification_type to severity
  await queryInterface.renameColumn('Alerts', 'notification_type', 'severity');
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Alerts', 'type');
  await queryInterface.renameColumn('Alerts', 'severity', 'notification_type');
};
