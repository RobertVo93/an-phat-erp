import { DataSource } from "typeorm";
import "reflect-metadata";
import * as dotenv from 'dotenv';
dotenv.config();
import { CollectionEntity } from "./entities/collection.entity";
import { CustomerEntity } from "./entities/customer.entity";
import { EmployeeEntity } from "./entities/employee.entity";
import { InvoiceEntity } from "./entities/invoice.entity";
import { OrderEntity } from "./entities/order.entity";
import { PayrollRecordEntity } from "./entities/payroll-record.entity";
import { ProductEntity } from "./entities/product.entity";
import { StockChangeEntity } from "./entities/stock-change.entity";
import { UtilityEntity } from "./entities/utility.entity";
import { WarehouseEntity } from "./entities/warehouse.entity";
import { AttendanceRecordEntity } from "./entities/attendance-record.entity";
import { UserEntity } from "./entities/user.entity";
import { UserPagePermissionEntity } from "./entities/user-page-permission.entity";
import { WarehouseProductEntity } from "./entities/warehouse-product.entity";
import { ProductionRecordEntity } from "./entities/production-record.entity";
import { ActivityLogEntity } from "./entities/activity-log.entity";
import { env } from "@/constants/env";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: false, // env.NODE_ENV === "development", // set to false in production and use migrations
  logging: false,
  entities: [
    // Base entities first (no dependencies)
    UserEntity,
    CustomerEntity,
    EmployeeEntity,
    WarehouseEntity,
    ProductEntity,
    CollectionEntity,
    UtilityEntity,
    InvoiceEntity,
    OrderEntity,
    // Dependent entities
    UserPagePermissionEntity,
    WarehouseProductEntity,
    ProductionRecordEntity,
    AttendanceRecordEntity,
    PayrollRecordEntity,
    StockChangeEntity,
    ActivityLogEntity
  ],
  ssl: { rejectUnauthorized: false }, // required for Neon
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});