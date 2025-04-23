'use strict';

import { Sequelize } from 'sequelize';

export const up = async (queryInterface) => {
  await queryInterface.addColumn('Agents', 'company_id', {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Agents', 'company_id');
};