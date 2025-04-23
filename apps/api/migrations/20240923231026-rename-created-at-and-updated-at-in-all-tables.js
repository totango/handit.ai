'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  for (const table of tables) {
    // check if table has createdAt and updatedAt columns
    const columns = await queryInterface.describeTable(table);
    if (!columns.createdAt || !columns.updatedAt) {
      continue;
    }
    await queryInterface.renameColumn(table, 'createdAt', 'created_at');
    await queryInterface.renameColumn(table, 'updatedAt', 'updated_at');
  }
};

export const down = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  for (const table of tables) {
    await queryInterface.renameColumn(table, 'created_at', 'createdAt');
    await queryInterface.renameColumn(table, 'updated_at', 'updatedAt');
  }
};
