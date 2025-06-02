import { AppDataSource as dataSource} from '../typeorm';

async function runMigrations() {
  try {
    await dataSource.initialize();

    console.log('DataSource initialized. Running migrations...');
    await dataSource.runMigrations();

    console.log('Migrations completed successfully.');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();
