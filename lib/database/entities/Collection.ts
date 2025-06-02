import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Product } from "./Product";
import { BaseEntity } from "./BaseEntity";
import { CollectionStatus, CollectionCategory } from "../../../types/enums";

@Entity({ name: "collections" })
export class Collection extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "int", nullable: true })
  productCount?: number;

  @Column({ type: "enum", enum: CollectionStatus, nullable: true })
  status?: CollectionStatus;

  @Column({ nullable: true })
  totalValue?: string;

  @Column({ type: "enum", enum: CollectionCategory, nullable: true })
  category?: CollectionCategory;

  @Column({ nullable: true })
  image?: string;

  //////Related fields//////
  @ManyToMany(() => Product, (product: Product) => product.collections, { nullable: true })
  @JoinTable({ name: "collection_products" })
  products!: Product[];
} 