'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('CompanyAlertsConfiguration', 'deleted_at', {
    type: Sequelize.DATE,
    allowNull: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('CompanyAlertsConfiguration', 'deleted_at');
};
