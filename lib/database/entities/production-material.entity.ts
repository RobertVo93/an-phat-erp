import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { WarehouseEntity } from "./warehouse.entity";
import { ProductEntity } from "./product.entity";
import type { Product as IProduct } from "@/types/product";
import type { Warehouse as IWarehouse } from "@/types/warehouse";
import { ProductionMaterial } from '@/types/productionMaterial';
import { ProductionRecordEntity } from "./production-record.entity";
import type { ProductionRecord as IProductionRecord } from "@/types/production";

@Entity({ name: "production_materials" })
export class ProductionMaterialEntity extends BaseEntity implements ProductionMaterial {
  @Column({ type: "float", nullable: false, default: 0 })
  quantity!: number;

  @Column({ type: "float", nullable: false, default: 0 })
  totalCost!: number;

  //////Related fields//////
  @ManyToOne(() => ProductionRecordEntity, (pr) => pr.productionMaterials, { nullable: false })
  @JoinColumn({ name: "production_id" })
  productionRecord!: IProductionRecord;

  @ManyToOne(() => ProductEntity, (product) => product.productionMaterials, { nullable: false })
  @JoinColumn({ name: "material_id" })
  material!: IProduct;
}
