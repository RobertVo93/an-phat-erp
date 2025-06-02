import { Entity, Column, OneToMany } from "typeorm";
import { OrderItem } from "./OrderItem";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "orders" })
export class Order extends BaseEntity {
  @Column()
  customer!: string;

  @Column({ nullable: true })
  customerEmail?: string;

  @Column({ nullable: true })
  customerPhone?: string;

  @Column()
  date!: string;

  @Column({ type: "float" })
  amount!: number;

  @Column({ type: "enum", enum: ["pending", "processing", "shipped", "delivered", "completed", "cancelled"] })
  status!: "pending" | "processing" | "shipped" | "delivered" | "completed" | "cancelled";

  @Column({ type: "enum", enum: ["pending", "paid", "partial", "failed", "refunded"] })
  paymentStatus!: "pending" | "paid" | "partial" | "failed" | "refunded";

  @Column({ type: "enum", enum: ["creditCard", "debitCard", "bankTransfer", "cash", "paypal"] })
  paymentMethod!: "creditCard" | "debitCard" | "bankTransfer" | "cash" | "paypal";

  @OneToMany(() => OrderItem, (item: OrderItem) => item.order, { cascade: true })
  items!: OrderItem[];

  @Column({ nullable: true })
  shippingAddress?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column("text", { array: true, nullable: true })
  tags?: string[];
} 