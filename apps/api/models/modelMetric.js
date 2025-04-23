'use strict';
import { Model, Op } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ModelMetric extends Model {
    static associate(models) {
      ModelMetric.belongsTo(models.Model, { foreignKey: 'model_id' });
      ModelMetric.hasMany(models.ModelMetricLog, {
        foreignKey: 'model_metric_id',
        as: 'Logs',
      });
    }

    async getAvgValueBetweenDates(startDate, endDate) {
      const ModelMetricLog = sequelize.models.ModelMetricLog;
      const logs = await ModelMetricLog.findAll({
        where: {
          modelMetricId: this.id,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      if (logs.length === 0) {
        return 0;
      }
      return logs.reduce((acc, log) => acc + (log.dataValues.value || 0), 0) / logs.length;
    }

    async getAvgValueOfLast30Days() {
      const ModelMetricLog = sequelize.models.ModelMetricLog;
      const logs = await ModelMetricLog.findAll({
        where: {
          modelMetricId: this.id,
          createdAt: {
            [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      });

      if (logs.length === 0) {
        return 0;
      }
      return logs.reduce((acc, log) => acc + (log.dataValues.value || 0), 0) / logs.length;
    }

    async createModelMetricLog({value, label = null, description = null}) {
      const ModelMetricLog = sequelize.models.ModelMetricLog;
      return ModelMetricLog.create({
        value: value || 0,
        modelMetricId: this.id,
        label: label || this.name,
        description: description || this.description
      });
    }

    async getLastModelMetricLogs(numberOfLogs) {
      const ModelMetricLog = sequelize.models.ModelMetricLog;
      return ModelMetricLog.findAll({
        where: {
          modelMetricId: this.id
        },
        limit: numberOfLogs,
        order: [['created_at', 'DESC']]
      });
    }
  }
  ModelMetric.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parameters: {
      type: DataTypes.JSON,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_id'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'ModelMetric',
    timestamps: true,
    paranoid: true,
  });
  return ModelMetric;
};
