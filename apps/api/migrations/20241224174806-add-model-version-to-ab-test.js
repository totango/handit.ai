'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('ABTestModels', 'model_version_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'ModelVersions',
      key: 'id',
    },
  });

  await queryInterface.addColumn('ABTestModels', 'optimized_model_version_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'ModelVersions',
      key: 'id',
    },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('ABTestModels', 'model_version_id');
  await queryInterface.removeColumn('ABTestModels', 'optimized_model_version_id');
};
