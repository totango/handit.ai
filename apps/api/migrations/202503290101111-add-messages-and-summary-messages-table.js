'use strict';

export const up = async (queryInterface, Sequelize) => {

  // Create messages table
  await queryInterface.createTable('Messages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    conversation_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    input: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    output: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  // Create index on conversation_id for Messages table
  await queryInterface.addIndex('Messages', ['conversation_id']);

  // Create summary_messages table
  await queryInterface.createTable('SummaryMessages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    conversation_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    summary: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  // Create index on conversation_id for SummaryMessages table
  await queryInterface.addIndex('SummaryMessages', ['conversation_id']);
};

export const down = async (queryInterface, Sequelize) => {
  // Drop indexes first
  await queryInterface.removeIndex('Messages', ['conversation_id']);
  await queryInterface.removeIndex('SummaryMessages', ['conversation_id']);

  // Drop tables
  await queryInterface.dropTable('Messages');
  await queryInterface.dropTable('SummaryMessages');

}; 
