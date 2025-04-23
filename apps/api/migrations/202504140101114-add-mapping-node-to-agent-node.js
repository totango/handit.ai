'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('AgentNodes', 'mapping_node_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'AgentNodes',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });

  // Add index for better query performance
  await queryInterface.addIndex('AgentNodes', ['mapping_node_id']);
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('AgentNodes', 'mapping_node_id');
}; 