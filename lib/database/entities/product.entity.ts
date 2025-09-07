import { Entity, Column, ManyToMany, OneToMany, BeforeInsert } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductStatus, ProductUnit } from "../../../types/enums";
import { CollectionEntity } from "./collection.entity";
import { Collection as ICollection } from "@/types/collection";
import { Product as IProduct } from "@/types/product";
import { WarehouseProductEntity } from "./warehouse-product.entity";
import { WarehouseProduct as IWarehouseProduct } from "@/types/warehouseProduct";
import { ProductionRecordEntity } from "./production-record.entity";
import type { ProductionRecord as IProductionRecord } from "@/types/production";
import { AppDataSource } from "../typeorm";

@Entity({ name: "products" })
export class ProductEntity extends BaseEntity implements IProduct {
  @Column({ nullable: false })
  name?: string;

  @Column({ type: "enum", enum: ProductUnit, nullable: false })
  unit?: ProductUnit;

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

  @OneToMany(() => WarehouseProductEntity, (wp) => wp.product, { nullable: true })
  warehouseProducts?: IWarehouseProduct[];

  @OneToMany(() => ProductionRecordEntity, (pr) => pr.product , {nullable: true})
  productionRecords?: IProductionRecord[];
  
  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    const repo = AppDataSource.getRepository(ProductEntity);
    const latest = await repo
      .createQueryBuilder("record")
      .orderBy("CAST(SUBSTRING(record.sku FROM 5) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.sku
      ? parseInt(latest.sku.replace("PRD-", ""), 10)
      : 0;

    this.sku = `PRD-${String(lastNumber + 1).padStart(5, "0")}`;
  }
} 