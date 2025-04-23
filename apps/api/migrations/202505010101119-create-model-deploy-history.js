'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('ModelDeployHistories', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    model_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Models',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    version: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Version of the model deployed',
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
  await queryInterface.addIndex('ModelDeployHistories', ['modelId']);
  await queryInterface.addIndex('ModelDeployHistories', ['version']);
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('ModelDeployHistories');
}; 