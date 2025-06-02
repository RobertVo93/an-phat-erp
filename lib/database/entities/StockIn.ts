import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { StockInStatus } from "../../../types/enums";
import { Warehouse } from "./Warehouse";
import type { Warehouse as IWarehouse } from "@/types/warehouse";

@Entity({ name: "stock_in" })
export class StockIn extends BaseEntity {
  @Column({ nullable: false })
  receiptNumber?: string;

  @Column({ type: "timestamp", nullable: true })
  date?: Date;
  
  @Column({ type: "jsonb", nullable: true })
  items?: Array<{ productId: string; productName: string; productSku: string; quantity: number; unitCost: number; totalCost: number }>;

  @Column({ type: "float", nullable: true })
  subtotal?: number;

  @Column({ type: "float", nullable: true })
  tax?: number;

  @Column({ type: "float", nullable: true })
  discount?: number;

  @Column({ type: "float", nullable: true })
  totalAmount?: number;

  @Column({ type: "enum", enum: StockInStatus, nullable: true })
  status?: StockInStatus;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  receivedBy?: string;

  @Column({ type: "timestamp", nullable: true })
  receivedDate?: Date;

  @Column({ nullable: true })
  referenceNumber?: string;


  //////Related fields//////
  @ManyToOne(() => Warehouse, (warehouse: Warehouse) => warehouse.stockIns, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: IWarehouse;
}