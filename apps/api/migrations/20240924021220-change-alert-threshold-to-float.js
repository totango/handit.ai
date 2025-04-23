'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.changeColumn('CompanyAlertsConfiguration', 'alert_threshold', {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: 0,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.changeColumn('CompanyAlertsConfiguration', 'alert_threshold', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0,
  });
};
