'use strict';

import session from 'express-session';
import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.createTable('ReviewersModels', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    reviewer_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Models',
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
    activation_threshold: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1000,
    },
    evaluation_percentage: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE,
    }
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('ReviewersModels');
};
