import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Product } from "./Product";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "collections" })
export class Collection extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ type: "int" })
  productCount!: number;

  @Column({ type: "enum", enum: ["Active", "Draft", "Archived"] })
  status!: "Active" | "Draft" | "Archived";

  @Column({ type: "date" })
  createdDate!: string;

  @Column()
  totalValue!: string;

  @Column({ type: "enum", enum: ["Fashion", "Electronics", "Home", "Office"] })
  category!: "Fashion" | "Electronics" | "Home" | "Office";

  @ManyToMany(() => Product)
  @JoinTable()
  products!: Product[];

  @Column({ nullable: true })
  image?: string;
} 