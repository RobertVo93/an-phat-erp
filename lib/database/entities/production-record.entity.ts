import { Entity, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductionStatus } from "@/types/enums";
import { ProductionRecord as IProductionRecord } from "@/types/production";
import { ProductEntity } from "./product.entity";
import type { Product as IProduct } from "@/types";
import { ProductionMaterialEntity } from "./production-material.entity";
import { ProductionMaterial } from "@/types/productionMaterial";
import { AppDataSource } from "../typeorm";
import { ProductionUtilityEntity } from "./production-utility.entity";
import type { ProductionUtility as IProductionUtility } from "@/types/productionUtility";
import { ProductionLaborEntity } from "./production-labor.entity";
import { ProductionLabor as IProductionLabor } from "@/types/ProductionLabor";
import { WarehouseEntity } from "./warehouse.entity";
import type { Warehouse as IWarehouse } from "@/types";

@Entity({ name: "production_records" })
export class ProductionRecordEntity extends BaseEntity implements IProductionRecord {
  @Column({ nullable: false })
  productionNumber?: string;

  @Column({ nullable: true })
  date?: string;

  @Column({ type: "int", nullable: true })
  quantity?: number;

  @Column({ type: "enum", enum: ProductionStatus, nullable: true })
  status?: ProductionStatus;

  @Column({ nullable: true })
  shift?: string;

  @Column({ nullable: true })
  operator?: string;

  @Column({ type: "float", nullable: true })
  totalCost?: number;

  //// Relations ////
  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.productionRecords, { nullable: true })
  @JoinColumn({ name: "product_id" })
  product?: IProduct;

  @OneToMany(() => ProductionMaterialEntity, (pm: ProductionMaterialEntity) => pm.productionRecord, { nullable: true })
  productionMaterials?: ProductionMaterial[];

  @OneToMany(() => ProductionUtilityEntity, (pu) => pu.productionRecord, { cascade: true })
  productionUtilities?: IProductionUtility[];

  @OneToMany(() => ProductionLaborEntity, (pl) => pl.productionRecord, { cascade: true })
  productionLabors?: IProductionLabor[];

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.productionRecords, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: IWarehouse;

  // Auto numbering
  @BeforeInsert()
  async generateOrderNumber() {
    const repo = AppDataSource.getRepository(ProductionRecordEntity);
    const latest = await repo
      .createQueryBuilder("productionRecord")
      .orderBy("CAST(SUBSTRING(productionRecord.productionNumber FROM 3) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.productionNumber
      ? parseInt(latest.productionNumber.replace("PR", ""), 10)
      : 0;

    this.productionNumber = `PR${lastNumber + 1}`;
  }
}