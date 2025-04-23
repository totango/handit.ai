'use strict';

import session from 'express-session';
import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.createTable('AnalyticsLogs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      allowNull: false,
    },
    event_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    event_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    active_users: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sessions: {
      type: Sequelize.INTEGER,
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
  await queryInterface.removeColumn('Users', 'last_login_at');
};
