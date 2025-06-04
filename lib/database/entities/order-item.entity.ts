import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "./product.entity";
import type { Product as IProduct } from "@/types/product";
import type { Order as IOrder } from "@/types/order";
import { OrderItem as IOrderItem } from "@/types/order";
import { BaseEntity } from "./base.entity";

@Entity({ name: "order_items" })
export class OrderItemEntity extends BaseEntity implements IOrderItem {
  @Column({ type: "int", nullable: true })
  quantity!: number;

  @Column({ type: "float", nullable: true })
  unitPrice!: number;

  @Column({ type: "float", nullable: true })
  total!: number;

  //////Related fields//////
  @ManyToOne(() => OrderEntity, (order: OrderEntity) => order.items, { nullable: true })
  @JoinColumn({ name: "order_id" })
  order!: IOrder;

  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.orderItems, { nullable: true })
  @JoinColumn({ name: "product_id" })
  product!: IProduct;
} 