import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Product } from "./Product";
import { BaseEntity } from "./BaseEntity";
import { CollectionStatus, CollectionCategory } from "../../../types/enums";
import { Product as IProduct } from "@/types/product";
import { Collection as ICollection } from "@/types/collection";

@Entity({ name: "collections" })
export class CollectionEntity extends BaseEntity implements ICollection {
  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "enum", enum: CollectionStatus, nullable: true })
  status?: CollectionStatus;

  @Column({ type: "enum", enum: CollectionCategory, nullable: true })
  category?: CollectionCategory;

  @Column({ nullable: true })
  image?: string;

  //////Related fields//////
  @ManyToMany(() => Product, (product: Product) => product.collections, { nullable: true })
  @JoinTable({ name: "collection_products" })
  products!: IProduct[];
} 