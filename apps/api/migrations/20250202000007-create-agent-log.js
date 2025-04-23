'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('agent_logs', {
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
    input: {
      type: Sequelize.JSON,
      allowNull: false
    },
    output: {
      type: Sequelize.JSON,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('pending', 'processing', 'completed', 'error'),
      allowNull: false,
      defaultValue: 'pending'
    },
    metadata: {
      type: Sequelize.JSON,
      allowNull: true
    },
    duration: {
      type: Sequelize.INTEGER,
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

  await queryInterface.addIndex('agent_logs', ['agent_id']);
  await queryInterface.addIndex('agent_logs', ['status']);
  await queryInterface.addIndex('agent_logs', ['created_at']);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('agent_logs');
}; 