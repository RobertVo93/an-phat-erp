import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { StockOutStatus } from "../../../types/enums";
import { Warehouse } from "./Warehouse";

@Entity({ name: "stock_out" })
export class StockOut extends BaseEntity {
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

  @Column({ type: "enum", enum: StockOutStatus, nullable: true })
  status?: StockOutStatus;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  receivedBy?: string;

  @Column({ type: "timestamp", nullable: true })
  receivedDate?: Date;

  @Column({ nullable: true })
  referenceNumber?: string;


  //////Related fields//////
  @ManyToOne(() => Warehouse, (warehouse: Warehouse) => warehouse.stockOuts, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: Warehouse;
}