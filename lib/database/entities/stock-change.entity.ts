import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { StockChangeType, StockChangeStatus } from "../../../types/enums";
import { WarehouseEntity } from "./warehouse.entity";
import type { Warehouse as IWarehouse } from "@/types/warehouse";
import { StockChange as IStockChange } from "@/types/stock-change";
import { AppDataSource } from "../typeorm";
import { StockProductEntity } from "./stock-product.entity";
import type { StockProduct as IStockProduct } from "@/types/stock-product";

@Entity({ name: "stock_change" })
export class StockChangeEntity extends BaseEntity implements IStockChange {
  @Column({ nullable: false })
  receiptNumber?: string;

  @Column({ type: "enum", enum: StockChangeType, nullable: false })
  type?: StockChangeType;

  @Column({ type: "timestamp", nullable: true })
  date?: Date;
  
  @Column({ type: "float", nullable: true })
  subtotal?: number;

  @Column({ type: "float", nullable: true })
  tax?: number;

  @Column({ type: "float", nullable: true })
  discount?: number;

  @Column({ type: "float", nullable: true })
  totalAmount?: number;

  @Column({ type: "enum", enum: StockChangeStatus, nullable: true })
  status?: StockChangeStatus;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  receivedBy?: string;

  @Column({ type: "timestamp", nullable: true })
  receivedDate?: Date;

  @Column({ nullable: true })
  referenceNumber?: string;

  @Column({ nullable: true })
  supplier?: string;

  //////Related fields//////
  @ManyToOne(() => WarehouseEntity, (warehouse: WarehouseEntity) => warehouse.stockChanges, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: IWarehouse;

  @OneToMany(() => StockProductEntity, (stockProduct: StockProductEntity) => stockProduct.stockChange, { nullable: true })
  stockProducts?: IStockProduct[]

  ////// Auto receipt numbering //////
  @BeforeInsert()
    async generateReceiptNumber() {
      const repo = AppDataSource.getRepository(StockChangeEntity);
      const latest = await repo
        .createQueryBuilder("stockChange")
        .orderBy("CAST(SUBSTRING(stockChange.receiptNumber FROM 4) AS INTEGER)", "DESC") 
        .getOne();
  
      const lastNumber = latest?.receiptNumber
        ? parseInt(latest.receiptNumber.replace("SI-", ""), 10)
        : 0;
  
      this.receiptNumber = `SI-${lastNumber + 1}`;
    }
}