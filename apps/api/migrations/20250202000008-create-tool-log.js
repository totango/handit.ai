'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('tool_logs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    agent_node_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'AgentNodes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    agent_log_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'agent_logs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    input: {
      type: Sequelize.JSON,
      allowNull: false
    },
    output: {
      type: Sequelize.JSON,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('success', 'error', 'timeout'),
      allowNull: false,
      defaultValue: 'success'
    },
    duration: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    metadata: {
      type: Sequelize.JSON,
      allowNull: true
    },
    error_details: {
      type: Sequelize.JSON,
      allowNull: true
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });

  await queryInterface.addIndex('tool_logs', ['agent_node_id']);
  await queryInterface.addIndex('tool_logs', ['agent_log_id']);
  await queryInterface.addIndex('tool_logs', ['status']);
  await queryInterface.addIndex('tool_logs', ['created_at']);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('tool_logs');
}; 