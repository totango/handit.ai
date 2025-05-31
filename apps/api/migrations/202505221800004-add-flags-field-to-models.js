// Migration to add flags field to Models table for storing logic-related flags

export const up = async (queryInterface, Sequelize) => {
  // Add flags field to Models table
  await queryInterface.addColumn('Models', 'flags', {
    type: Sequelize.JSONB,
    allowNull: true,
    defaultValue: null,
    comment: 'JSON field for storing logic-related flags and metadata'
  });
};

export const down = async (queryInterface) => {
  // Remove flags field from Models table
  await queryInterface.removeColumn('Models', 'flags');
}; 