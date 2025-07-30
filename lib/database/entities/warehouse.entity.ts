import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { WarehouseStatus, WarehouseType, WarehouseTemperature } from "../../../types/enums";
import { StockChangeEntity } from "./stock-change.entity";
import { StockChange as IStockChange } from "@/types/stock-change";
import { Warehouse as IWarehouse } from "@/types/warehouse";
import { WarehouseProductEntity } from "./warehouse-product.entity";
import { WarehouseProduct as IWarehouseProduct } from "@/types/warehouseProduct";
import type { Order as IOrder } from "@/types/order";
import { OrderEntity } from "./order.entity";
import { ProductionRecordEntity } from "./production-record.entity";
import type { ProductionRecord as IProductionRecord } from "@/types/production";

@Entity({ name: "warehouses" })
export class WarehouseEntity extends BaseEntity implements IWarehouse {
  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  manager?: string;

  @Column({ type: "int", nullable: true })
  capacity?: number;

  @Column({ type: "int", nullable: true })
  occupied?: number;

  @Column({ type: "enum", enum: WarehouseStatus, nullable: true })
  status?: WarehouseStatus;

  @Column({ type: "enum", enum: WarehouseType, nullable: true })
  type?: WarehouseType;

  @Column({ type: "int", nullable: true })
  zones?: number;

  @Column({ type: "enum", enum: WarehouseTemperature, nullable: true })
  temperature?: WarehouseTemperature;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  description?: string;

  //////Related fields//////
  @OneToMany(() => StockChangeEntity, (stockChange: StockChangeEntity) => stockChange.warehouse, { nullable: true })
  stockChanges?: IStockChange[];

  @OneToMany(() => WarehouseProductEntity, (wp) => wp.warehouse, { nullable: true })
  warehouseProducts?: IWarehouseProduct[];

  @OneToMany(() => OrderEntity, (order) => order.warehouse, { nullable: true })
  orders?: IOrder[];

  @OneToMany(() => ProductionRecordEntity, (pr) => pr.warehouse, { nullable: true })
  productionRecords?: IProductionRecord[];
}