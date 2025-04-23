'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.changeColumn('Alerts', 'model_metric_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'ModelMetrics',
      key: 'id',
    },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.changeColumn('Alerts', 'model_metric_id', {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'ModelMetrics',
      key: 'id',
    },
  });
};
