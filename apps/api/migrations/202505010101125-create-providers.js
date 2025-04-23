'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Providers', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    config: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
  await queryInterface.addConstraint('Providers', {
    fields: ['name', 'type'],
    type: 'unique',
    name: 'unique_provider_name_type'
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('Providers');
}; 