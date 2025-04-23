'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_ModelLogs_status" ADD VALUE IF NOT EXISTS 'crash';
  `);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_ModelLogs_status" DROP VALUE IF EXISTS 'crash';
  `);
}; 
