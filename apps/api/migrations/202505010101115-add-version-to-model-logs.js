'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('ModelLogs', 'version', {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: '1',
    comment: 'Version of the model when the log was created'
  });

  // Add index for better query performance
  await queryInterface.addIndex('ModelLogs', ['version']);
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ModelLogs', 'version');
}; 