'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('AgentNodes', 'initial_node', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Flag to indicate if this is the initial/starting node in the agent flow'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('AgentNodes', 'initial_node');
}; 