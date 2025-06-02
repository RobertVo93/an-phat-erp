import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { WarehouseStatus, WarehouseType, WarehouseTemperature } from "../../../types/enums";
import { StockIn } from "./StockIn";
import { StockOut } from "./StockOut";
import { StockIn as IStockIn } from "@/types/stock-in";
import { StockOut as IStockOut } from "@/types/stock-out";


@Entity({ name: "warehouses" })
export class Warehouse extends BaseEntity {
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
  @OneToMany(() => StockIn, (stockIn: StockIn) => stockIn.warehouse, { nullable: true })
  stockIns?: IStockIn[];

  @OneToMany(() => StockOut, (stockOut: StockOut) => stockOut.warehouse, { nullable: true })
  stockOuts?: IStockOut[];
}