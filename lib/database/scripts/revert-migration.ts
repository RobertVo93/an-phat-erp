import { AppDataSource as dataSource } from '../typeorm';

async function revertLastMigration() {
  try {
    await dataSource.initialize();

    console.log('DataSource initialized. Reverting last migration...');
    await dataSource.undoLastMigration();

    console.log('Reverted last migration successfully (if any).');

    await dataSource.destroy();
  } catch (error) {
    console.error('Error reverting migration:', error);
    process.exit(1);
  }
}

revertLastMigration();
