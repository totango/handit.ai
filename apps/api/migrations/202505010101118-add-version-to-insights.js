'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Insights', 'version', {
    type: Sequelize.STRING,
    allowNull: true,
    comment: 'Version of the model when the insight was created'
  });
  await queryInterface.addIndex('Insights', ['version']);
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Insights', 'version');
}; 