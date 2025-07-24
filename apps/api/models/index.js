'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';
import configFile from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

//let sequelize;
const databaseUrl = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.TIMESERIES_DB_PORT}/${process.env.DB_NAME}`;
let sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
});
/*if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}*/

const initializeModels = async () => {
  const modelFiles = fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    });

  // Asynchronously import all models and wait for them to resolve
  await Promise.all(
    modelFiles.map(async (file) => {
      const { default: modelInit } = await import(path.join(__dirname, file));

      // Initialize the model
      const model = modelInit(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    })
  );

  // Set up associations after all models have been initialized
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
};

await initializeModels();

export default db;
