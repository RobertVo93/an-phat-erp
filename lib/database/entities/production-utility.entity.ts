import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductionRecordEntity } from "./production-record.entity";
import { UtilityEntity } from "./utility.entity";
import type { ProductionUtility as IProductionUtility } from "@/types/productionUtility";

@Entity({ name: "production_utilities" })
export class ProductionUtilityEntity extends BaseEntity implements IProductionUtility{
  @ManyToOne(() => ProductionRecordEntity, (production) => production.productionUtilities, { onDelete: "CASCADE" })
  @JoinColumn({ name: "production_id" })
  productionRecord?: IProductionUtility;

  @ManyToOne(() => UtilityEntity, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "utility_id" })
  utility?: UtilityEntity;

  @Column({ type: "float", nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ type: "float", nullable: true })
  cost?: number;
}
