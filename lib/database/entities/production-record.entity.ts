import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductionStatus } from "@/types/enums";
import { IProductionElement, ProductionRecord as IProductionRecord, StockChange as IStockChange } from "@/types";
import type { Employee as IEmployee, Product as IProduct, Warehouse as IWarehouse } from "@/types";
import { ProductEntity } from "./product.entity";
import { WarehouseEntity } from "./warehouse.entity";
import { EmployeeEntity } from "./employee.entity";
import { StockChangeEntity } from "./stock-change.entity";
import { handleStatusCompleted } from "@/lib/services/productionService";
import { CommonService } from "@/lib/services/commonService";

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
  @OneToMany(() => StockChangeEntity, (stockChange: StockChangeEntity) => stockChange.productionRecord, { nullable: true })
  stockChanges?: IStockChange[];

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
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(ProductionRecordEntity, "PRN");
    }
  }

  @BeforeUpdate()
  async handleStatusCompleted() {
    if (this.status === ProductionStatus.completed) {
      // Create 2 stock-change records after production is completed, using a transaction
      handleStatusCompleted(this);
    }
  }
}
