// Migration to add optimization_token_id to Company

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Companies', 'optimization_token_id', {
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
  await queryInterface.removeColumn('Companies', 'optimization_token_id');
}; 