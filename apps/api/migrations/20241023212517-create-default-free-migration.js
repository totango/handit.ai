'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  // ADD FREE PLAN record TO MEMBERSHIP table with id = 1
  await queryInterface.bulkInsert('Memberships', [
    {
      id: 1,
      name: 'FREE',
      limits: '{"models": 3, "datasets": 3, "reviewedEntries": 50}',
      price: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('Memberships', { id: 1 });
};
