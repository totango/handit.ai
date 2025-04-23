'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.createTable('ModelLogs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    input: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    output: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    parameters: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    is_correct: {
      type: Sequelize.BOOLEAN,
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
    model_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Models',
        key: 'id',
      },
      allowNull: false,
    },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('ModelLogs');
};
