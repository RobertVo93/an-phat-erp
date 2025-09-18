import { execSync } from 'child_process';

async function revertLastMigration() {
  try {
    execSync(`TS_NODE_PROJECT=tsconfig.typeorm.json ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d lib/database/typeorm.ts`, {
      stdio: 'inherit'
    });
  }
  catch (error) {
    console.error('Error reverting migration:', error);
    process.exit(1);
  }
}

revertLastMigration();
