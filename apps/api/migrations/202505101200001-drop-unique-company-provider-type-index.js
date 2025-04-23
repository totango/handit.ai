// Migration to drop the unique_company_provider_type index from IntegrationTokens

export const up = async (queryInterface) => {
  await queryInterface.removeConstraint('IntegrationTokens', 'unique_company_provider_type');
};

export const down = async (queryInterface, Sequelize) => {
  // Re-add the unique constraint if needed
  await queryInterface.addConstraint('IntegrationTokens', {
    fields: ['company_id', 'provider_id', 'type'],
    type: 'unique',
    name: 'unique_company_provider_type',
  });
}; 