import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "stock_in" })
export class StockIn extends BaseEntity {
  @Column()
  receiptNumber!: string;

  @Column()
  date!: string;

  @Column()
  supplierId!: string;

  @Column()
  supplierName!: string;

  @Column()
  warehouseId!: string;

  @Column()
  warehouseName!: string;

  @Column({ type: "jsonb" })
  items!: Array<{ productId: string; productName: string; productSku: string; quantity: number; unitCost: number; totalCost: number }>;

  @Column({ type: "float" })
  subtotal!: number;

  @Column({ type: "float" })
  tax!: number;

  @Column({ type: "float" })
  discount!: number;

  @Column({ type: "float" })
  totalAmount!: number;

  @Column({ type: "enum", enum: ["draft", "pending", "in_transit", "completed", "cancelled"] })
  status!: "draft" | "pending" | "in_transit" | "completed" | "cancelled";

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  receivedBy?: string;

  @Column({ nullable: true })
  receivedDate?: string;

  @Column({ nullable: true })
  referenceNumber?: string;
} 