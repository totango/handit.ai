'use strict';
import { Model, Op } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ModelMetricLog extends Model {
    static associate(models) {
      // Define associations here
      ModelMetricLog.belongsTo(models.ModelMetric, {
        foreignKey: 'model_metric_id',
      });
      ModelMetricLog.hasMany(models.ModelMetricLog, {
        foreignKey: 'model_metric_id',
        as: 'Logs',
      });
    }

    async getAlertConfigurations() {
      return sequelize.models.CompanyAlertsConfiguration.findAll({
        where: {
          modelMetricId: this.modelMetricId,
        },
      });
    }

    async getLastModelMetricLogs(numberOfLogs) {
      const ModelMetricLog = sequelize.models.ModelMetricLog;
      return ModelMetricLog.findAll({
        where: {
          modelMetricId: this.modelMetricId,
        },
        limit: numberOfLogs,
        order: [['created_at', 'DESC']],
      });
    }

    async getAllModelMetricLogs() {
      const ModelMetricLog = sequelize.models.ModelMetricLog;
      return ModelMetricLog.findAll({
        where: {
          modelMetricId: this.modelMetricId,
        },
        order: [['created_at', 'DESC']],
      });
    }

    async checkAlertCreation(alert) {
      const type = alert.alertType;
      let value = 0;
      if (type === 'average') {
        const logs = await this.getLastModelMetricLogs(10);
        if (logs.length == 0) {
          return false;
        }
        const sum = (logs || []).reduce((acc, log) => acc + log.value, 0);
        value = sum / logs.length;
      } else if (type === 'max_min') {
        const logs = await this.getLastModelMetricLogs(10);
        if (logs.length == 0) {
          return false;
        }
        const max = Math.max(...logs.map((log) => log.value));
        const min = Math.min(...logs.map((log) => log.value));
        value = max - min;
      } else if (type === 'last') {
        const logs = await this.getLastModelMetricLogs(1);
        if (logs.length == 0) {
          return false;
        }
        
        value = logs[0].value;
      }

      if (alert.comparingOperator === 'greater_than') {
        return value > alert.alertThreshold;
      } else if (alert.comparingOperator === 'less_than') {
        return value < alert.alertThreshold;
      } else if (alert.comparingOperator === 'equal') {
        return value === alert.alertThreshold;
      }

      return false;
    }
  }
  ModelMetricLog.init(
    {
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      modelMetricId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'model_metric_id',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
      logs: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
      version: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Version of the model when the metric log was created'
      },
    },
    {
      sequelize,
      modelName: 'ModelMetricLog',
      timestamps: true,
      paranoid: true,
      hooks: {
        afterCreate: async (modelMetricLog, options) => {
          if (modelMetricLog.label === 'health_check') {
            if (modelMetricLog.value === 0) {
              const modelMetric = await sequelize.models.ModelMetric.findOne({
                where: {
                  id: modelMetricLog.modelMetricId,
                },
              });
              await sequelize.models.Alert.create({
                severity: 'critical',
                description: modelMetricLog.description,
                type: 'error',
                data: {
                  title: 'Error in call to Model endpoint',
                  message: modelMetricLog.description,
                },
                modelId: modelMetric.modelId,
                modelMetricId: modelMetric.id,
              });
            }
          } else {
            // create alert record
            const modelMetric = await sequelize.models.ModelMetric.findOne({
              where: {
                id: modelMetricLog.modelMetricId,
              },
            });
            const alerts = await modelMetricLog.getAlertConfigurations();
            alerts.forEach(async (alert) => {
              if (await modelMetricLog.checkAlertCreation(alert)) {
                // check for the same alert in the last 8 hours
                const lastAlert = await sequelize.models.Alert.findOne({
                  where: {
                    modelMetricId: modelMetricLog.modelMetricId,
                    createdAt: {
                      [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 8),
                    },
                  },
                });
                if (lastAlert) {
                  return;
                }
                
                const avgValue = await modelMetric.getAvgValueOfLast30Days();
                const target = modelMetric.target;
                await sequelize.models.Alert.create({
                  modelMetricId: modelMetricLog.modelMetricId,
                  severity: alert.alertSeverity,
                  description: `Alert triggered for ${modelMetricLog.label} with value ${modelMetricLog.value}`,
                  type: 'metric',
                  data: {
                    modelMetric: modelMetricLog.label,
                    value: modelMetricLog.value,
                    avgValue: avgValue,
                    target,
                    logs: modelMetricLog.logs,
                  },
                  modelId: modelMetric.modelId,
                });
              }
            });

            const model = await sequelize.models.Model.findByPk(modelMetric.modelId);
            const modelGroup = await model.getModelGroup();
            const companyId = modelGroup.companyId;

            // calculate the average value of the current week and save it in the MetricRange model
            const currentWeek = new Date();
            currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
            const startOfWeek = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()));
            // set hour at 00:00:00
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 6));
            // set hour at 23:59:59
            endOfWeek.setHours(23, 59, 59, 999);
            
            const averageValue = await modelMetric.getAvgValueBetweenDates(startOfWeek, endOfWeek);
            let metricRecord = await sequelize.models.MetricRange.findOne({
              where: {
                companyId: companyId,
                entityType: 'model',
                entityId: modelMetric.modelId,
                rangeType: 'weekly',
                startDate: startOfWeek,
                endDate: endOfWeek,
              },
            });
            if (!metricRecord) {
              await sequelize.models.MetricRange.create({
                companyId: companyId,
                entityType: 'model',
                entityId: modelMetric.modelId,
                rangeType: 'weekly',
                startDate: startOfWeek,
                endDate: endOfWeek,
                metrics: {},
              });
              metricRecord = await sequelize.models.MetricRange.findOne({
                where: {
                  companyId: companyId,
                  entityType: 'model',
                  entityId: modelMetric.modelId,
                  rangeType: 'weekly',
                  startDate: startOfWeek,
                  endDate: endOfWeek,
                },
              });
            }

            const metrics = metricRecord.metrics;

            metrics[modelMetricLog.label] = averageValue;
            await sequelize.models.MetricRange.update({
              metrics: metrics,
            }, {
              where: {
                id: metricRecord.id,
              },
            });
          }
        },
      },
    }
  );
  return ModelMetricLog;
};
