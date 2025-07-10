// src/entities/production-labor.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductionRecordEntity } from "./production-record.entity";
import { EmployeeEntity } from "./employee.entity";
import { ProductionLabor as IProductionLabor } from "@/types/ProductionLabor";
import type { ProductionRecord as IProductionRecord } from "@/types/production";
import type { Employee as IEmployee } from "@/types";

@Entity({ name: "production_labors" })
export class ProductionLaborEntity extends BaseEntity implements IProductionLabor {
  @Column({ type: "float", nullable: true })
  totalCost?: number;

  @ManyToOne(() => ProductionRecordEntity, (production) => production.productionLabors, { onDelete: "CASCADE" })
  @JoinColumn({ name: "production_id" })
  productionRecord?: IProductionRecord;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.productionLabors, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employee_id" })
  employee?: IEmployee;
}
