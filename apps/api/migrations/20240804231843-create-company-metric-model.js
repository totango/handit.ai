'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.createTable('CompanyMetricModels', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    company_metric_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'CompanyMetrics',
        key: 'id',
      },
      allowNull: false,
    },
    model_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Models',
        key: 'id',
      },
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('CompanyMetricModels');
};
