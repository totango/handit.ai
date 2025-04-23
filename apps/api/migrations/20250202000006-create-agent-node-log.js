'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('agent_node_logs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    agent_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Agents',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    input: {
      type: Sequelize.JSON,
      allowNull: false
    },
    output: {
      type: Sequelize.JSON,
      allowNull: false
    },
    metadata: {
      type: Sequelize.JSON,
      allowNull: true
    },
    operation_type: {
      type: Sequelize.STRING,
      allowNull: false
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
    error_details: {
      type: Sequelize.JSON,
      allowNull: true
    },
    processed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    metric_processed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    parent_log_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'agent_node_logs',
        key: 'id'
      }
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

  // Add indexes for better query performance
  await queryInterface.addIndex('agent_node_logs', ['agent_id']);
  await queryInterface.addIndex('agent_node_logs', ['agent_node_id']);
  await queryInterface.addIndex('agent_node_logs', ['operation_type']);
  await queryInterface.addIndex('agent_node_logs', ['status']);
  await queryInterface.addIndex('agent_node_logs', ['created_at']);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('agent_node_logs');
}; 