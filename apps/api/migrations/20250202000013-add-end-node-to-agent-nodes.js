'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('AgentNodes', 'end_node', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Flag to indicate if this is the final/end node in the agent flow'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('AgentNodes', 'end_node');
}; 