// migrations/20240925000002-create-agent-node.js
'use strict';

import { Sequelize } from 'sequelize';

export const up = async (queryInterface) => {
  await queryInterface.createTable('AgentNodes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    agent_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Agents',
        key: 'id'
      }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('model', 'tool'),
      allowNull: false
    },
    config: {
      type: Sequelize.JSON
    },
    model_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Models',
        key: 'id'
      }
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deleted_at: {
      type: Sequelize.DATE
    }
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('AgentNodes');
};