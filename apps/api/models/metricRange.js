'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MetricRange extends Model {
    static associate(models) {
      MetricRange.belongsTo(models.Company, {
        foreignKey: 'company_id',
        as: 'company',
      });
    }

    static async getMetricsForEntity({
      companyId,
      entityType,
      entityId,
      rangeType,
      startDate,
      endDate,
    }) {
      return await this.findAll({
        where: {
          company_id: companyId,
          entity_type: entityType,
          entity_id: entityId,
          range_type: rangeType,
          start_date: {
            [sequelize.Sequelize.Op.gte]: startDate,
          },
          end_date: {
            [sequelize.Sequelize.Op.lte]: endDate,
          },
        },
        order: [['start_date', 'ASC']],
      });
    }

    static async upsertMetrics({
      companyId,
      entityType,
      entityId,
      rangeType,
      startDate,
      endDate,
      metrics,
    }) {
      const [metricRange] = await this.findOrCreate({
        where: {
          company_id: companyId,
          entity_type: entityType,
          entity_id: entityId,
          range_type: rangeType,
          start_date: startDate,
          end_date: endDate,
        },
        defaults: {
          metrics,
        },
      });

      if (!metricRange.isNewRecord) {
        await metricRange.update({ metrics });
      }

      return metricRange;
    }
  }

  MetricRange.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'company_id',
      },
      entityType: {
        type: DataTypes.ENUM('agent', 'model'),
        allowNull: false,
        field: 'entity_type',
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'entity_id',
      },
      rangeType: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        allowNull: false,
        field: 'range_type',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date',
      },
      metrics: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        field: 'metrics',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      modelName: 'MetricRange',
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeUpdate: (instance) => {
          instance.updated_at = new Date();
        },
      },
    }
  );

  return MetricRange;
}; 