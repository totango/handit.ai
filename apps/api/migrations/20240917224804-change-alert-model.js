'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('Alerts', 'model_metric_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'ModelMetrics',
      key: 'id',
    },
  });

  // Add relation to Model
  await queryInterface.addColumn('Alerts', 'model_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'Models',
      key: 'id',
    },
  });

  // Remove relation with Company
  await queryInterface.removeColumn('Alerts', 'company_id');
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Alerts', 'model_metric_id');
  await queryInterface.removeColumn('Alerts', 'model_id');

  await queryInterface.addColumn('Alerts', 'company_id', {
    type: Sequelize.INTEGER,
    references: {
      model: 'Companies',
      key: 'id',
    },
    allowNull: false,
  });
};
