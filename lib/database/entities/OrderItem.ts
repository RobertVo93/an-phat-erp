import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";
import type { Product as IProduct } from "@/types/product";
import type { Order as IOrder } from "@/types/order";

@Entity({ name: "order_items" })
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "int", nullable: true })
  quantity!: number;

  @Column({ type: "float", nullable: true })
  unitPrice!: number;

  @Column({ type: "float", nullable: true })
  total!: number;

  //////Related fields//////
  @ManyToOne(() => Order, (order: Order) => order.items, { nullable: true })
  @JoinColumn({ name: "order_id" })
  order!: IOrder;

  @ManyToOne(() => Product, (product: Product) => product.orderItems, { nullable: true })
  @JoinColumn({ name: "product_id" })
  product!: IProduct;
} 