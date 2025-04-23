'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_agent_logs_status" ADD VALUE IF NOT EXISTS 'failed';
  `);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.sequelize.query(`
    UPDATE agent_logs 
    SET status = 'error' 
    WHERE status = 'failed';
  `);
}; 
