'use strict';


export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Companies', 'active_messages', {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    after: 'id'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Companies', 'active_messages');
}; 