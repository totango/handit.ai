'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('InsightsModels', 'version', {
    type: Sequelize.STRING,
    allowNull: true,
    comment: 'Version of the model when the insight was created'
  });
  await queryInterface.addIndex('InsightsModels', ['version']);
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('InsightsModels', 'version');
}; 