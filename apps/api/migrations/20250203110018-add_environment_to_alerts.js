'use strict';

export const up = async (queryInterface, Sequelize) => {
  // First create the ENUM type
  await queryInterface.sequelize.query(
    `CREATE TYPE "enum_Alerts_environment" AS ENUM ('production', 'staging');`
  );

  // Then add the column
  await queryInterface.addColumn('Alerts', 'environment', {
    type: Sequelize.ENUM('production', 'staging'),
    allowNull: false,
    defaultValue: 'production',
    after: 'model_id',
  });

  // Update existing records to use production environment
  await queryInterface.sequelize.query(
    `UPDATE "Alerts" SET environment = 'production' WHERE environment IS NULL;`
  );
};

export const down = async (queryInterface, Sequelize) => {
  // Remove the column
  await queryInterface.removeColumn('Alerts', 'environment');

  // Drop the ENUM type
  await queryInterface.sequelize.query(`DROP TYPE "enum_Alerts_environment";`);
};
