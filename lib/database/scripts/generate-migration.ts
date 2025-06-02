import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const args = process.argv.slice(2);
const customName = args[0];

if (!customName) {
  console.error('❌ Please provide a migration name. Usage: pnpm migration:gen CreateUsersTable');
  process.exit(1);
}

// 👇 Format: yyyyddmm
const now = new Date();
const formattedDate = now.getFullYear().toString() +
  String(now.getDate()).padStart(2, '0') +
  String(now.getMonth() + 1).padStart(2, '0');

const migrationsDir = path.join('lib/database/migrations');

// 1. Generate migration with dummy name
const tempName = 'TempMigration';
const tempPath = path.join(migrationsDir, tempName);

console.log(`📦 Generating migration script...`);

try {
  execSync(`pnpm exec ts-node ./node_modules/typeorm/cli.js migration:generate ${tempPath} -d lib/database/typeorm.ts`, {
    stdio: 'inherit',
  });

  // 2. Find the newly generated migration
  const files = fs.readdirSync(migrationsDir);
  const generatedFile = files.find(file => file.includes(tempName) && file.endsWith('.ts'));

  if (!generatedFile) {
    console.error('❌ Migration file not found after generation.');
    process.exit(1);
  }

  const newFileName = `${formattedDate}-${customName}.ts`;
  fs.renameSync(
    path.join(migrationsDir, generatedFile),
    path.join(migrationsDir, newFileName)
  );

  console.log(`✅ Migration renamed to: ${newFileName}`);
} catch (error) {
  console.error('❌ Error during migration generation:', error);
}
