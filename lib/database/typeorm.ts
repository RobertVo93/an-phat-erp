import { DataSource } from "typeorm";
import "reflect-metadata";
import * as dotenv from 'dotenv';
dotenv.config();
import { Collection } from "./entities/Collection";
import { Customer } from "./entities/Customer";
import { Employee } from "./entities/Employee";
import { Invoice } from "./entities/Invoice";
import { Order } from "./entities/Order";
import { OrderItem } from "./entities/OrderItem";
import { PayrollRecord } from "./entities/PayrollRecord";
import { Product } from "./entities/Product";
import { StockIn } from "./entities/StockIn";
import { StockOut } from "./entities/StockOut";
import { Utility } from "./entities/Utility";
import { Warehouse } from "./entities/Warehouse";
import { AttendanceRecord } from "./entities/AttendanceRecord";
import { UtilityReading } from "./entities/UtilityReading";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false, // set to false in production and use migrations
  logging: false,
  entities: [
    Collection,
    Customer,
    Employee,
    Invoice,
    Order,
    OrderItem,
    PayrollRecord,
    Product,
    StockIn,
    StockOut,
    Utility,
    Warehouse,
    AttendanceRecord,
    UtilityReading,
  ],
  ssl: { rejectUnauthorized: false }, // required for Neon
  migrations: ['lib/database/migrations/*.ts'],
}); 