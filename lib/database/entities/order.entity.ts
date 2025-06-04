import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { OrderItemEntity } from "./order-item.entity";
import { BaseEntity } from "./base.entity";
import { OrderStatus, PaymentStatus, PaymentMethod } from "../../../types/enums";
import { CustomerEntity } from "./customer.entity";
import type { Customer as ICustomer } from "@/types/customer";
import { OrderItem as IOrderItem } from "@/types/order";
import { Order as IOrder } from "@/types/order";

@Entity({ name: "orders" })
export class OrderEntity extends BaseEntity implements IOrder {
  @Column({ type: "timestamp", nullable: true })
  deliveryDate?: Date;

  @Column({ type: "float", nullable: true })
  totalAmount?: number;

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
  @ManyToOne(() => CustomerEntity, (customer: CustomerEntity) => customer.orders, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer?: ICustomer;

  @OneToMany(() => OrderItemEntity, (item: OrderItemEntity) => item.order, { cascade: true, nullable: true })
  items!: IOrderItem[];
}