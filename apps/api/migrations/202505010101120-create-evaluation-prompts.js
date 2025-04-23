'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('EvaluationPrompts', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    prompt: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    metric: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_global: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    company_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('EvaluationPrompts');
}; 