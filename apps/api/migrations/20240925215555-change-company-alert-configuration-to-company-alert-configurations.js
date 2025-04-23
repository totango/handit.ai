'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.renameTable('CompanyAlertsConfiguration', 'CompanyAlertConfigurations');
};

export const down = async (queryInterface) => {
  await queryInterface.renameTable('CompanyAlertConfigurations', 'CompanyAlertsConfiguration');
};
