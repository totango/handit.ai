'use strict';
import { Model } from 'sequelize';
//import { sendTemplatedBulkEmail } from '../src/services/emailService.js';

export default (sequelize, DataTypes) => {
  class Alert extends Model {
    static associate(models) {
      Alert.belongsTo(models.Model, { foreignKey: 'model_id' });
    }
  }
  Alert.init({
    severity: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'severity'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    modelMetricId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_metric_id'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'model_id'
    },
    environment: {
      type: DataTypes.ENUM('production', 'staging'),
      allowNull: false,
      defaultValue: 'production',
      field: 'environment'
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
    modelName: 'Alert',
    timestamps: true,
    paranoid: true,
    hooks: {
      afterCreate: async (alert, options) => {
        const model = await sequelize.models.Model.findByPk(alert.modelId);
        const modelGroup = await model.getModelGroup();
        const company = await modelGroup.getCompany();
        const users = await company.getUsers();
        const emails = users.map(user => user.email);
        
        // Only send emails for production environment
        if (alert.environment === 'production') {
          /*sendTemplatedBulkEmail(
            {
              recipients: emails,
              subject: 'New Alert from Handit.AI',
              templateName: 'alertTemplate',
              templateData: {
                errorType: alert.severity.toUpperCase(),
                errorDescription: alert.description,
                errodDate: new Date().toLocaleString(),
                errorModel: model.dataValues.name,
                alertLink: 'https://dashboard.handit.ai.com/alerts/' + alert.id,
                year: new Date().getFullYear(),
              },
            }
          )*/
        }
      }
    }
  });
  return Alert;
};
