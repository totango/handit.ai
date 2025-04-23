'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.createTable('Insights', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    model_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Models',
        key: 'id',
      },
      allowNull: false,
    },
    problem: {
      type: Sequelize.STRING(1000),
      allowNull: false,
    },
    solution: {
      type: Sequelize.STRING(1000),
      allowNull: false,
    },
    data: {
      type: Sequelize.JSONB,
      allowNull: false,
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
  await queryInterface.dropTable('ABTestModels');
};
