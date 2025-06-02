import { Entity, Column, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ProductStatus } from "../../../types/enums";
import { CollectionEntity } from "./Collection";
import { OrderItem } from "./OrderItem";
import { Collection as ICollection } from "@/types/collection";
import { OrderItem as IOrderItem } from "@/types/order";

@Entity({ name: "products" })
export class Product extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "float", nullable: true })
  price?: number;

  @Column({ type: "float", nullable: true })
  cost?: number;

  @Column({ type: "int", nullable: true })
  stock?: number;

  @Column({ type: "int", nullable: true })
  minStock?: number;

  @Column({ nullable: true })
  sku?: string;

  @Column({ nullable: true })
  barcode?: string;

  @Column({ type: "enum", enum: ProductStatus, nullable: true })
  status?: ProductStatus;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ nullable: true })
  image?: string;

  //////Related fields//////
  @ManyToMany(() => CollectionEntity, (collection) => collection.products, { nullable: true })
  collections?: ICollection[];

  @OneToMany(() => OrderItem, (item: OrderItem) => item.product, { nullable: true })
  orderItems?: IOrderItem[];
} 