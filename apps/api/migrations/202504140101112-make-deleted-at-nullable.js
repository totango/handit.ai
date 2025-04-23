'use strict';

export const up = async (queryInterface, Sequelize) => {
  const messagesDesc = await queryInterface.describeTable('Messages');
  // Add deleted_at column to Messages

  if (!messagesDesc.deleted_at) {
    await queryInterface.addColumn('Messages', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
  // Add deleted_at column to SummaryMessages
  const summaryDesc = await queryInterface.describeTable('SummaryMessages');

  if (!summaryDesc.deleted_at) {
    await queryInterface.addColumn('SummaryMessages', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }

  // Make deleted_at nullable in Messages table
  await queryInterface.changeColumn('Messages', 'deleted_at', {
    type: Sequelize.DATE,
    allowNull: true
  });

  // Make deleted_at nullable in SummaryMessages table
  await queryInterface.changeColumn('SummaryMessages', 'deleted_at', {
    type: Sequelize.DATE,
    allowNull: true
  });
};

export const down = async (queryInterface, Sequelize) => {
  // Revert deleted_at to not nullable in Messages table
  await queryInterface.changeColumn('Messages', 'deleted_at', {
    type: Sequelize.DATE,
    allowNull: false
  });

  // Revert deleted_at to not nullable in SummaryMessages table
  await queryInterface.changeColumn('SummaryMessages', 'deleted_at', {
    type: Sequelize.DATE,
    allowNull: false
  });
}; 