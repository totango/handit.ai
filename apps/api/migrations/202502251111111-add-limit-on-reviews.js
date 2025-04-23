'use strict';

export const up = async (queryInterface, Sequelize) => {
  try {
    await queryInterface.addColumn('ReviewersModels', 'limit', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 30,
    });

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    await queryInterface.removeColumn('ReviewersModels', 'limit');
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
};
