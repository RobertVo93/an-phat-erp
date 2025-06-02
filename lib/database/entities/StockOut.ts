import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "stock_out" })
export class StockOut extends BaseEntity {
  @Column()
  receiptNumber!: string;

  @Column()
  date!: string;

  @Column()
  customerId!: string;

  @Column()
  customerName!: string;

  @Column()
  customerPhone!: string;

  @Column()
  customerAddress!: string;

  @Column()
  warehouseId!: string;

  @Column()
  warehouseName!: string;

  @Column({ type: "jsonb" })
  products!: Array<{ id: string; productId: string; productName: string; sku: string; quantity: number; unitPrice: number; totalPrice: number; availableStock: number }>;

  @Column({ type: "float" })
  subtotal!: number;

  @Column({ type: "float" })
  discount!: number;

  @Column({ type: "enum", enum: ["percentage", "fixed"] })
  discountType!: "percentage" | "fixed";

  @Column({ type: "float" })
  tax!: number;

  @Column({ type: "float" })
  totalAmount!: number;

  @Column({ type: "enum", enum: ["draft", "processing", "shipped", "delivered", "cancelled"] })
  status!: "draft" | "processing" | "shipped" | "delivered" | "cancelled";

  @Column({ nullable: true })
  orderReference?: string;

  @Column({ nullable: true })
  trackingNumber?: string;

  @Column()
  shippingMethod!: string;

  @Column()
  notes!: string;

  @Column()
  processedBy!: string;
} 