import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { AppDataSource } from "@/lib/database/typeorm";
import { ProductionStatus } from "@/types/enums";
import { IProductionElement, ProductionRecord as IProductionRecord } from "@/types";
import type { Employee as IEmployee, Product as IProduct, Warehouse as IWarehouse } from "@/types";
import { ProductEntity, WarehouseEntity, EmployeeEntity } from "@/lib/database/entities";
import { handleStatusCompleted } from "@/lib/services/productionService";

@Entity({ name: "production_records" })
export class ProductionRecordEntity extends BaseEntity implements IProductionRecord {
  @Column({ unique: true })
  number?: string;

  @Column({ nullable: true })
  date?: Date;

  @Column({ type: "int", nullable: true })
  quantity?: number;

  @Column({ type: "enum", enum: ProductionStatus, nullable: true })
  status?: ProductionStatus;

  @Column({ type: "float", nullable: true })
  totalCost?: number;

  @Column({ type: "float", nullable: true })
  totalExpense?: number;

  @Column({ type: "jsonb", nullable: true })
  materials?: IProductionElement[]

  @Column({ type: "jsonb", nullable: true })
  utilities?: IProductionElement[]

  @Column({ type: "jsonb", nullable: true })
  labors?: IProductionElement[]

  //// Relations ////
  @ManyToOne(() => EmployeeEntity, (employee: EmployeeEntity) => employee.productionRecords, { nullable: true })
  @JoinColumn({ name: "pic_id" })
  pic?: IEmployee;

  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.productionRecords, { nullable: true })
  @JoinColumn({ name: "product_id" })
  product?: IProduct;

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.productionRecords, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: IWarehouse;

  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    const repo = AppDataSource.getRepository(ProductionRecordEntity);
    const latest = await repo
      .createQueryBuilder("record")
      .orderBy("CAST(SUBSTRING(record.number FROM 5) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.number
      ? parseInt(latest.number.replace("PRN-", ""), 10)
      : 0;

    this.number = `PRN-${String(lastNumber + 1).padStart(5, "0")}`;
  }

  @BeforeUpdate()
  async handleStatusCompleted() {
    if (this.status === ProductionStatus.completed) {
      // Create 2 stock-change records after production is completed, using a transaction
      handleStatusCompleted(this);
    }
  }
}