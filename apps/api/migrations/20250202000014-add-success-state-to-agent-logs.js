'use strict';

export const up = async (queryInterface, Sequelize) => {
  // First, we need to change the enum type
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_agent_logs_status" ADD VALUE IF NOT EXISTS 'success';
  `);

  // Then update any 'completed' statuses to 'success' if needed
  await queryInterface.sequelize.query(`
    UPDATE "AgentLogs"
    SET status = 'success'
    WHERE status = 'completed';
  `);
};

export const down = async (queryInterface, Sequelize) => {
  // Update any 'success' statuses back to 'completed'
  await queryInterface.sequelize.query(`
    UPDATE "AgentLogs"
    SET status = 'completed'
    WHERE status = 'success';
  `);

  // Note: PostgreSQL doesn't support removing values from an enum type
  // The only way would be to:
  // 1. Create a new enum type
  // 2. Update the column to use the new type
  // 3. Drop the old type
  // This is complex and risky, so we'll leave the enum value in place
}; 