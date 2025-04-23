'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('CompanyAlertsConfiguration', 'alert_severity', {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 'info',
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('CompanyAlertsConfiguration', 'alert_severity');
};
