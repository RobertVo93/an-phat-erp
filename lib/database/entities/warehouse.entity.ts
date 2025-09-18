import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { WarehouseStatus } from "@/types/enums";
import { StockChangeEntity } from "@/lib/database/entities/stock-change.entity";
import { StockChange as IStockChange } from "@/types/stock-change";
import { Warehouse as IWarehouse } from "@/types/warehouse";
import { WarehouseProductEntity } from "@/lib/database/entities/warehouse-product.entity";
import { WarehouseProduct as IWarehouseProduct } from "@/types/warehouseProduct";
import type { Order as IOrder } from "@/types/order";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { ProductionRecordEntity } from "@/lib/database/entities/production-record.entity";
import type { ProductionRecord as IProductionRecord } from "@/types/production";
import { AppDataSource } from "@/lib/database/typeorm";

@Entity({ name: "warehouses" })
export class WarehouseEntity extends BaseEntity implements IWarehouse {
  @Column({ unique: true})
  number?: string;

  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  manager?: string;

  @Column({ type: "enum", enum: WarehouseStatus, nullable: true })
  status?: WarehouseStatus;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  main?: boolean;

  //////Related fields//////
  @OneToMany(() => StockChangeEntity, (stockChange: StockChangeEntity) => stockChange.warehouse, { nullable: true })
  stockChanges?: IStockChange[];

  @OneToMany(() => WarehouseProductEntity, (wp) => wp.warehouse, { nullable: true })
  warehouseProducts?: IWarehouseProduct[];

  @OneToMany(() => OrderEntity, (order) => order.warehouse, { nullable: true })
  orders?: IOrder[];

  @OneToMany(() => ProductionRecordEntity, (pr) => pr.warehouse, { nullable: true })
  productionRecords?: IProductionRecord[];
  
  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    const repo = AppDataSource.getRepository(WarehouseEntity);
    const latest = await repo
      .createQueryBuilder("record")
      .orderBy("CAST(SUBSTRING(record.number FROM 5) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.number
      ? parseInt(latest.number.replace("WHS-", ""), 10)
      : 0;

    this.number = `WHS-${String(lastNumber + 1).padStart(5, "0")}`;
  }
}