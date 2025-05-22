// Migration to add optimization_model_id to Company

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Companies', 'optimization_model', {
    type: Sequelize.STRING,
    allowNull: true,
    comment: 'Model used for optimization',
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Companies', 'optimization_model');
}; 