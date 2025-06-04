import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { WarehouseStatus, WarehouseType, WarehouseTemperature } from "../../../types/enums";
import { StockInEntity } from "./stock-in.entity";
import { StockOutEntity } from "./stock-out.entity";
import { StockIn as IStockIn } from "@/types/stock-in";
import { StockOut as IStockOut } from "@/types/stock-out";
import { Warehouse as IWarehouse } from "@/types/warehouse";


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
  @OneToMany(() => StockInEntity, (stockIn: StockInEntity) => stockIn.warehouse, { nullable: true })
  stockIns?: IStockIn[];

  @OneToMany(() => StockOutEntity, (stockOut: StockOutEntity) => stockOut.warehouse, { nullable: true })
  stockOuts?: IStockOut[];
}