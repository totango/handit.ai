'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('AgentNodes', 'slug', {
    type: Sequelize.STRING,
    allowNull: true,
    comment: 'Optional identifier for the node, primarily used for tool types'
  });

  // Create index for faster lookups
  await queryInterface.addIndex('AgentNodes', ['slug']);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('AgentNodes', 'slug');
}; 