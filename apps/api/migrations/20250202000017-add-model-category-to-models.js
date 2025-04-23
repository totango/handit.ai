'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Models', 'model_category', {
    type: Sequelize.STRING, 
    allowNull: false,
    defaultValue: 'other',
    comment: 'Category of the model indicating its primary function'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Models', 'model_category');
}; 