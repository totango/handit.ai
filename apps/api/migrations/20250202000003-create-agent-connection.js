// migrations/20240925000003-create-agent-connection.js
'use strict';

import { Sequelize } from 'sequelize';

export const up = async (queryInterface) => {
  await queryInterface.createTable('AgentConnections', {
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
    from_node_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'AgentNodes',
        key: 'id'
      }
    },
    to_node_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'AgentNodes',
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
  await queryInterface.dropTable('AgentConnections');
};