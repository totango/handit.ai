'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Agents', 'auto_stop', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Flag to indicate if agent should automatically stop and close logs when reaching an end node'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Agents', 'auto_stop');
}; 