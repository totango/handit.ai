'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.renameColumn('Alerts', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('Companies', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('CompanyMetricLogs', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('CompanyMetricModels', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('CompanyMetrics', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('DatasetGroups', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('Datasets', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('ModelDatasets', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('ModelGroups', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('ModelLogs', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('ModelMetricLogs', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('ModelMetrics', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('Models', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('Users', 'deletedAt', 'deleted_at');
  await queryInterface.renameColumn('Companies', 'apiToken', 'api_token');
};

export const down = async (queryInterface) => {
  // Implement down logic if needed to revert the renaming of columns
};
