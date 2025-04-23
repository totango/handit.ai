/**
 * @file Migration to add LLM provider configurations to Companies table
 * @description This migration adds a JSON column to store multiple LLM provider configurations
 * for each company, allowing companies to configure different AI providers with their
 * respective tokens and models.
 */

'use strict';

import { Sequelize } from 'sequelize';

/**
 * Migration to add the llms column to Companies table
 * @type {import('sequelize-cli').Migration}
 * 
 * The llms column stores a JSON object with the following structure:
 * {
 *   "provider_name": {
 *     "name": "Provider Display Name",
 *     "token": "API Token or Key",
 *     "model": "Model Identifier"
 *   },
 *   "another_provider": {
 *     "name": "Another Provider",
 *     "token": "Another API Token",
 *     "model": "Another Model"
 *   }
 * }
 * 
 * This structure allows companies to:
 * 1. Configure multiple LLM providers
 * 2. Store provider-specific API tokens
 * 3. Specify which models to use with each provider
 * 4. Add or remove providers without schema changes
 */
export const up = async (queryInterface) => {
    // Add the llms column to Companies table
    await queryInterface.addColumn('Companies', 'llms', {
        type: Sequelize.JSON,
        allowNull: true, // Allow null for existing records
        comment: 'Stores LLM provider configurations with their respective tokens and models',
        defaultValue: {}, // Initialize with empty object for new records
    });
};

/**
 * Rollback function to remove the llms column
 * @type {import('sequelize-cli').Migration}
 * 
 * This function:
 * 1. Removes the llms column from Companies table
 * 2. Is used when rolling back the migration
 * 3. Will delete all stored LLM configurations
 */
export const down = async (queryInterface) => {
    await queryInterface.removeColumn('Companies', 'llms');
}; 