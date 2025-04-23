'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('IntegrationTokens', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    company_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    provider_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Providers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    secret: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    data: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    expires_at: {
      type: Sequelize.DATE,
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
  await queryInterface.addConstraint('IntegrationTokens', {
    fields: ['company_id', 'provider_id', 'type'],
    type: 'unique',
    name: 'unique_company_provider_type'
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('IntegrationTokens');
}; 