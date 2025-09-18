# An phat erp system

## How to run
- To install library
  ```bash
  pnpm install
  ```
- To start the project
  ```bash
  docker compose up -d
  ```


## How to generate db migration scripts
1. open a terminal at root folder
2. Check your .env file to have the below db information
```bash
DATABASE_URL="postgresql://connection-string"
```
3. run the command
```bash
pnpm migration:gen NameOfMigrationScript
```

## How to apply the migration scripts to your db
1. open a terminal at root folder
2. Check your .env file to have the below db information
```bash
DATABASE_URL="postgresql://connection-string"
```
3. run the command
```bash
pnpm migration:run
```

## How to revert the last migration script to your db
1. open a terminal at root folder
2. Check your .env file to have the below db information
```bash
DATABASE_URL="postgresql://connection-string"
```
3. run the command
```bash
pnpm migration:revert
```