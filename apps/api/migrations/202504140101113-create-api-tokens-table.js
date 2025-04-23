'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('ApiTokens', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  // Add index on token for faster lookups
  await queryInterface.addIndex('ApiTokens', ['token']);
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('ApiTokens');
};
