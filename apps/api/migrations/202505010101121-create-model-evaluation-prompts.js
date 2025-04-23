'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('ModelEvaluationPrompts', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    model_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Models',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    evaluation_prompt_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'EvaluationPrompts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    provider_model: {
      type: Sequelize.STRING,
      allowNull: true,
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
  await queryInterface.dropTable('ModelEvaluationPrompts');
}; 