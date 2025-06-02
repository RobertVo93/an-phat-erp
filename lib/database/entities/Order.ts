import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { OrderItem } from "./OrderItem";
import { BaseEntity } from "./BaseEntity";
import { OrderStatus, PaymentStatus, PaymentMethod } from "../../../types/enums";
import { Customer } from "./Customer";

@Entity({ name: "orders" })
export class Order extends BaseEntity {
  @Column({ type: "timestamp", nullable: true })
  date?: Date;

  @Column({ type: "float", nullable: true })
  amount?: number;

  @Column({ type: "enum", enum: OrderStatus, nullable: true })
  status?: OrderStatus;

  @Column({ type: "enum", enum: PaymentStatus, nullable: true })
  paymentStatus?: PaymentStatus;

  @Column({ type: "enum", enum: PaymentMethod, nullable: true })
  paymentMethod?: PaymentMethod;

  @Column({ nullable: true })
  shippingAddress?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column("text", { array: true, nullable: true })
  tags?: string[];

  //////Related fields//////
  @ManyToOne(() => Customer, (customer: Customer) => customer.orders, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer?: Customer;

  @OneToMany(() => OrderItem, (item: OrderItem) => item.order, { cascade: true, nullable: true })
  items!: OrderItem[];
}