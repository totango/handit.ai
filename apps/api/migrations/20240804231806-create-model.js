'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.createTable('Models', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING, // Changed from FLOAT to STRING for model names
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    provider: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    model_creation_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    parameters: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    model_group_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'ModelGroups',
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
  await queryInterface.dropTable('Models');
};
