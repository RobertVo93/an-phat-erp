import { DataSource } from "typeorm";
import "reflect-metadata";
import * as dotenv from 'dotenv';
dotenv.config();
import { CollectionEntity } from "./entities/Collection";
import { CustomerEntity } from "./entities/customer.entity";
import { Employee } from "./entities/Employee";
import { Invoice } from "./entities/Invoice";
import { OrderEntity } from "./entities/order.entity";
import { OrderItemEntity } from "./entities/order-item.entity";
import { PayrollRecord } from "./entities/PayrollRecord";
import { ProductEntity } from "./entities/product.entity";
import { StockIn } from "./entities/StockIn";
import { StockOut } from "./entities/StockOut";
import { Utility } from "./entities/Utility";
import { Warehouse } from "./entities/Warehouse";
import { AttendanceRecord } from "./entities/AttendanceRecord";
import { UtilityReading } from "./entities/UtilityReading";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true, // set to false in production and use migrations
  logging: false,
  entities: [
    CollectionEntity,
    CustomerEntity,
    Employee,
    Invoice,
    OrderEntity,
    OrderItemEntity,
    PayrollRecord,
    ProductEntity,
    StockIn,
    StockOut,
    Utility,
    Warehouse,
    AttendanceRecord,
    UtilityReading,
  ],
  ssl: { rejectUnauthorized: false }, // required for Neon
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});