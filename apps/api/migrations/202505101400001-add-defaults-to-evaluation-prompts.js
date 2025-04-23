// Migration to add default_provider_model and default_integration_token_id to EvaluationPrompts

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('EvaluationPrompts', 'default_provider_model', {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn('EvaluationPrompts', 'default_integration_token_id', {
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
  await queryInterface.removeColumn('EvaluationPrompts', 'default_provider_model');
  await queryInterface.removeColumn('EvaluationPrompts', 'default_integration_token_id');
}; 