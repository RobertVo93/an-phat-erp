import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "products" })
export class Product extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  category!: string;

  @Column({ type: "float" })
  price!: number;

  @Column({ type: "float" })
  cost!: number;

  @Column({ type: "int" })
  stock!: number;

  @Column({ type: "int" })
  minStock!: number;

  @Column()
  sku!: string;

  @Column({ nullable: true })
  barcode?: string;

  @Column({ type: "enum", enum: ["active", "inactive", "lowStock", "outOfStock"] })
  status!: "active" | "inactive" | "lowStock" | "outOfStock";

  @Column({ nullable: true })
  supplier?: string;

  @Column({ nullable: true })
  image?: string;
} 