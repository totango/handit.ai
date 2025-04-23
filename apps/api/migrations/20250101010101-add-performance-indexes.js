'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  // Model Logs Indexes
  await queryInterface.addIndex('ModelLogs', ['model_id', 'is_correct', 'created_at'], {
    name: 'idx_model_logs_model_correct_date'
  });

  await queryInterface.addIndex('ModelLogs', ['model_id', 'created_at'], {
    name: 'idx_model_logs_model_date'
  });

  // Model Metric Logs Indexes
  await queryInterface.addIndex('ModelMetricLogs', ['model_metric_id', 'created_at'], {
    name: 'idx_model_metric_logs_metric_date'
  });

  await queryInterface.addIndex('ModelMetricLogs', ['value', 'created_at'], {
    name: 'idx_model_metric_logs_value_date'
  });

  // Model Indexes
  await queryInterface.addIndex('Models', ['model_group_id', 'type'], {
    name: 'idx_models_group_type'
  });

  await queryInterface.addIndex('Models', ['deleted_at'], {
    name: 'idx_models_deleted'
  });

  // Alert Indexes
  await queryInterface.addIndex('Alerts', ['model_id', 'severity', 'created_at'], {
    name: 'idx_alerts_severity_date'
  });

  await queryInterface.addIndex('Alerts', ['model_metric_id', 'created_at'], {
    name: 'idx_alerts_metric_date'
  });

  await queryInterface.addIndex('Alerts', ['deleted_at'], {
    name: 'idx_alerts_deleted'
  });

  // Model Metrics Indexes
  await queryInterface.addIndex('ModelMetrics', ['model_id', 'type'], {
    name: 'idx_model_metrics_model_type'
  });

  // Company Metrics Indexes
  await queryInterface.addIndex('CompanyMetrics', ['company_id', 'type'], {
    name: 'idx_company_metrics_company_type'
  });

  // Dataset Indexes
  await queryInterface.addIndex('Datasets', ['dataset_group_id', 'type'], {
    name: 'idx_datasets_group_type'
  });
};

export const down = async (queryInterface) => {
  // Remove Model Logs Indexes
  await queryInterface.removeIndex('ModelLogs', 'idx_model_logs_model_correct_date');
  await queryInterface.removeIndex('ModelLogs', 'idx_model_logs_model_date');

  // Remove Model Metric Logs Indexes
  await queryInterface.removeIndex('ModelMetricLogs', 'idx_model_metric_logs_metric_date');
  await queryInterface.removeIndex('ModelMetricLogs', 'idx_model_metric_logs_value_date');

  // Remove Model Indexes
  await queryInterface.removeIndex('Models', 'idx_models_group_type');
  await queryInterface.removeIndex('Models', 'idx_models_deleted');

  // Remove Alert Indexes
  await queryInterface.removeIndex('Alerts', 'idx_alerts_severity_date');
  await queryInterface.removeIndex('Alerts', 'idx_alerts_metric_date');
  await queryInterface.removeIndex('Alerts', 'idx_alerts_deleted');

  // Remove Model Metrics Indexes
  await queryInterface.removeIndex('ModelMetrics', 'idx_model_metrics_model_type');

  // Remove Company Metrics Indexes
  await queryInterface.removeIndex('CompanyMetrics', 'idx_company_metrics_company_type');

  // Remove Dataset Indexes
  await queryInterface.removeIndex('Datasets', 'idx_datasets_group_type');
}; 