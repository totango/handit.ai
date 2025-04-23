'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('MetricRanges', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    company_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    entity_type: {
      type: Sequelize.ENUM('agent', 'model'),
      allowNull: false,
    },
    entity_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    range_type: {
      type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'yearly'),
      allowNull: false,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    metrics: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  // Add indexes for better query performance
  await queryInterface.addIndex('MetricRanges', ['company_id']);
  await queryInterface.addIndex('MetricRanges', ['entity_type', 'entity_id']);
  await queryInterface.addIndex('MetricRanges', ['range_type']);
  await queryInterface.addIndex('MetricRanges', ['start_date', 'end_date']);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('MetricRanges');
};
