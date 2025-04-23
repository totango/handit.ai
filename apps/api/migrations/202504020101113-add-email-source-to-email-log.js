'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Emails', 'notification_source', {
    type: Sequelize.STRING,
    allowNull: true,
    after: 'id'
  });

  await queryInterface.addColumn('Emails', 'source_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    after: 'notification_source'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Emails', 'notification_source');
  await queryInterface.removeColumn('Emails', 'source_id');
}; 