'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.renameTable('CompanyAlertConfigurations', 'CompanyAlertsConfigurations');
};

export const down = async (queryInterface) => {
  await queryInterface.renameTable('CompanyAlertsConfigurations', 'CompanyAlertConfigurations');
};
