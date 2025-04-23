'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('ModelLogs', 'agent_log_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'agent_logs',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });

  await queryInterface.addIndex('ModelLogs', ['agent_log_id']);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('ModelLogs', 'agent_log_id');
}; 