'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Agents', 'slug', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique identifier for the agent in camelCase format'
  });

  // Create index for faster lookups
  await queryInterface.addIndex('Agents', ['slug'], {
    unique: true
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Agents', 'slug');
}; 