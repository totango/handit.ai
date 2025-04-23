import { Sequelize } from 'sequelize';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
});

// Define the name of the migration tracking table
const migrationTableName = 'SequelizeMeta';

const rollbackSpecificMigration = async (migrationName) => {
  const migrationsDir = path.join(__dirname, 'migrations'); // Fix path resolution
  const files = await readdir(migrationsDir);

  // Check if the specified migration file exists
  if (!files.includes(migrationName)) {
    console.error(`Migration file ${migrationName} does not exist.`);
    return;
  }

  // Check which migrations have already been applied
  const appliedMigrations = await sequelize.query(`SELECT * FROM "${migrationTableName}"`, {
    type: Sequelize.QueryTypes.SELECT
  });

  const appliedMigrationNames = appliedMigrations.map(migration => migration.name);

  // Check if the specified migration has been applied
  if (!appliedMigrationNames.includes(migrationName)) {
    console.error(`Migration ${migrationName} has not been applied.`);
    return;
  }

  // Import and rollback the specified migration
  const migration = await import(path.join(migrationsDir, migrationName));
  console.log(`Rolling back migration: ${migrationName}`);
  
  // Run the migration's down function
  await migration.down(sequelize.getQueryInterface(), Sequelize);
  
  // Remove the migration record from the applied migrations table
  await sequelize.query(`DELETE FROM "${migrationTableName}" WHERE name = :name`, {
    replacements: { name: migrationName }
  });

  console.log(`Successfully rolled back migration: ${migrationName}`);
};

const migrationName = process.argv[2]; // Get the migration name from command line arguments
if (!migrationName) {
  console.error('Please provide a migration name to rollback.');
  process.exit(1);
}

rollbackSpecificMigration(migrationName)
  .then(() => {
    sequelize.close();
  })
  .catch((error) => {
    console.error('Error rolling back migration:', error);
    sequelize.close();
  });
