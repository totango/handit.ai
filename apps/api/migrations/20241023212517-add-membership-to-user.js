'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('Users', 'membership_id', {
    type: Sequelize.INTEGER,
    references: {
      model: 'Memberships',
      key: 'id',
    },
    allowNull: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Users', 'membership_id');
};
