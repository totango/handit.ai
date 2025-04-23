'use strict';

export const up = async (queryInterface, Sequelize) => {
  // Remove the old metric column
  await queryInterface.removeColumn('EvaluationPrompts', 'metric');
  // Add the new metric_id column
  await queryInterface.addColumn('EvaluationPrompts', 'metric_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'EvaluatorMetrics',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
};

export const down = async (queryInterface, Sequelize) => {
  // Remove the metric_id column
  await queryInterface.removeColumn('EvaluationPrompts', 'metric_id');
  // Add the old metric column back
  await queryInterface.addColumn('EvaluationPrompts', 'metric', {
    type: Sequelize.STRING,
    allowNull: false,
  });
}; 