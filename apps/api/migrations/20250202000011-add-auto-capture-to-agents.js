'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Agents', 'auto_capture', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Flag to indicate if agent should automatically capture data'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Agents', 'auto_capture');
}; 