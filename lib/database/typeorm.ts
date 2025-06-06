import { DataSource } from "typeorm";
import "reflect-metadata";
import * as dotenv from 'dotenv';
dotenv.config();
import { CollectionEntity } from "./entities/collection.entity";
import { CustomerEntity } from "./entities/customer.entity";
import { EmployeeEntity } from "./entities/employee.entity";
import { InvoiceEntity } from "./entities/invoice.entity";
import { OrderEntity } from "./entities/order.entity";
import { OrderItemEntity } from "./entities/order-item.entity";
import { PayrollRecordEntity } from "./entities/payroll-record.entity";
import { ProductEntity } from "./entities/product.entity";
import { StockInEntity } from "./entities/stock-in.entity";
import { StockOutEntity } from "./entities/stock-out.entity";
import { UtilityEntity } from "./entities/utility.entity";
import { WarehouseEntity } from "./entities/warehouse.entity";
import { AttendanceRecordEntity } from "./entities/attendance-record.entity";
import { UtilityReading } from "./entities/utility-reading.entity";
import { UserEntity } from "./entities/user.entity";
import { UserPagePermissionEntity } from "./entities/user-page-permission.entity";
import { env } from "@/constants/env";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: env.NODE_ENV === "development", // set to false in production and use migrations
  logging: false,
  entities: [
    CollectionEntity,
    CustomerEntity,
    EmployeeEntity,
    InvoiceEntity,
    OrderEntity,
    OrderItemEntity,
    PayrollRecordEntity,
    ProductEntity,
    StockInEntity,
    StockOutEntity,
    UtilityEntity,
    WarehouseEntity,
    AttendanceRecordEntity,
    UtilityReading,
    UserEntity,
    UserPagePermissionEntity,
  ],
  ssl: { rejectUnauthorized: false }, // required for Neon
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});