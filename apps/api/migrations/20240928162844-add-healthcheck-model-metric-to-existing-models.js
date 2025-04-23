'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  const models = await queryInterface.sequelize.query('SELECT * FROM "Models"');

  for (let i = 0; i < models[0].length; i++) {
    const model = models[0][i];
    const metrics = await queryInterface.sequelize.query(`SELECT * FROM "ModelMetrics" WHERE "model_id" = ${model.id}`);
    const health = metrics[0].find(metric => metric.type === 'health_check');
    if (!health) {
      await queryInterface.sequelize.query(`INSERT INTO "ModelMetrics" ("model_id", "parameters", "type", "name", "description", "created_at", "updated_at") VALUES (${model.id}, '{}', 'health_check', 'Healthcheck', 'Healthcheck of the model', NOW(), NOW())`);
    }
  }
};

export const down = async (queryInterface) => {
  // Add reverting commands here if needed
};
