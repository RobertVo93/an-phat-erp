import { Entity, Column, OneToMany, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { OrderItemEntity } from "./order-item.entity";
import { BaseEntity } from "./base.entity";
import { OrderStatus, PaymentStatus, PaymentMethod } from "../../../types/enums";
import { CustomerEntity } from "./customer.entity";
import type { Customer as ICustomer } from "@/types/customer";
import { OrderItem as IOrderItem } from "@/types/order";
import { Order as IOrder } from "@/types/order";
import { AppDataSource } from "../typeorm";
import { WarehouseEntity } from "./warehouse.entity";
import type { Warehouse as IWarehouse } from "@/types/warehouse";

@Entity({ name: "orders" })
export class OrderEntity extends BaseEntity implements IOrder {
  @Column({ unique: true })
  orderNumber?: string;

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

  @Column({ type: "float", nullable: true })
  shippingFee?: number;

  @Column({ type: "float", nullable: true })
  tax?: number;

  //////Related fields//////
  @ManyToOne(() => CustomerEntity, (customer: CustomerEntity) => customer.orders, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer?: ICustomer;

  @OneToMany(() => OrderItemEntity, (item: OrderItemEntity) => item.order, { cascade: true, nullable: true })
  items!: IOrderItem[];

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.orders, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: IWarehouse;
  //////Auto order numbering//////
  @BeforeInsert()
  async generateOrderNumber() {
    const repo = AppDataSource.getRepository(OrderEntity);
    const latest = await repo
      .createQueryBuilder("order")
      .orderBy("CAST(SUBSTRING(order.orderNumber FROM 5) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.orderNumber
      ? parseInt(latest.orderNumber.replace("ORD-", ""), 10)
      : 0;

    this.orderNumber = `ORD-${lastNumber + 1}`;
  }
}