'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('ModelEvaluationPrompts', 'integration_token_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'IntegrationTokens',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ModelEvaluationPrompts', 'integration_token_id');
}; 