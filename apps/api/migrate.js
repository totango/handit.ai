import { Sequelize } from 'sequelize';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = `postgresql://${process.env.TIMESERIES_DB_USER}:${process.env.TIMESERIES_DB_PASSWORD}@${process.env.TIMESERIES_DB_HOST}:${process.env.TIMESERIES_DB_PORT}/${process.env.HANDIT_DB_NAME}`;
// Initialize Sequelize instance
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: console.log,
});

// Define the name of the migration tracking table
const migrationTableName = 'SequelizeMeta'


const runMigrations = async () => {
  // Ensure the SequelizeMeta table exists
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "${migrationTableName}" (
      name VARCHAR(255) PRIMARY KEY
    )
  `);
  const migrationsDir = path.join(__dirname, 'migrations');  // Fix path resolution
  const files = await readdir(migrationsDir);

  // Sort files to ensure migrations run in the correct order
  const migrationFiles = files
    .filter((file) => file.endsWith('.js'))
    .sort();

  // Check which migrations have already been applied
  const appliedMigrations = await sequelize.query(`SELECT * FROM "${migrationTableName}"`, {
    type: Sequelize.QueryTypes.SELECT
  });

  const appliedMigrationNames = appliedMigrations.map(migration => migration.name);

  for (const file of migrationFiles) {
    // Skip migrations that have already been applied
    if (appliedMigrationNames.includes(file)) {
      console.log(`Migration already applied: ${file}`);
      continue;
    }

    const migration = await import(path.join(migrationsDir, file));
    console.log(`Running migration: ${file}`);
    
    // Run the migration's up function
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    
    // Record the migration as applied
    await sequelize.query(`INSERT INTO "${migrationTableName}" (name) VALUES (:name)`, {
      replacements: { name: file }
    });
  }
};

runMigrations()
  .then(() => {
    console.log('All migrations have been run.');
    sequelize.close();
  })
  .catch((error) => {
    console.error('Error running migrations:', error);
    sequelize.close();
  });
