import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";

@Entity({ name: "order_items" })
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  productId!: string;

  @Column()
  productName!: string;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "float" })
  unitPrice!: number;

  @Column({ type: "float" })
  total!: number;

  @ManyToOne(() => Order, (order: Order) => order.items)
  order!: Order;
} 