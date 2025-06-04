import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductionStatus } from "@/types/enums";

@Entity({ name: "production_records" })
export class ProductionRecordEntity extends BaseEntity {
  @Column({ nullable: true })
  date?: string;

  @Column({ nullable: true })
  product?: string;

  @Column({ type: "int", nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ type: "enum", enum: ProductionStatus, nullable: true })
  status?: ProductionStatus;

  @Column({ nullable: true })
  statusText?: string;

  @Column({ nullable: true })
  shift?: string;

  @Column({ nullable: true })
  operator?: string;

  @Column({ type: "jsonb", nullable: true })
  rawMaterials?: Array<{ name: string; quantity: number; unit: string; cost: number }>;

  @Column({ type: "jsonb", nullable: true })
  utilities?: Array<{ name: string; quantity: number; unit: string; cost: number }>;

  @Column({ type: "jsonb", nullable: true })
  labor?: { hours: number; workers: number; cost: number };

  @Column({ type: "float", nullable: true })
  totalCost?: number;

  @Column({ type: "float", nullable: true })
  efficiency?: number;
}