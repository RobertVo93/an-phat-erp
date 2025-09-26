import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { WarehouseStatus } from "@/types/enums";
import type { Order as IOrder, ProductionRecord as IProductionRecord } from "@/types";
import {
  StockChange as IStockChange,
  Warehouse as IWarehouse,
  WarehouseProduct as IWarehouseProduct
} from "@/types";
import {
  StockChangeEntity,
  WarehouseProductEntity,
  OrderEntity,
  ProductionRecordEntity
} from "@/lib/database/entities";
import { CommonService } from "@/lib/services/commonService";

@Entity({ name: "warehouses" })
export class WarehouseEntity extends BaseEntity implements IWarehouse {
  @Column({ unique: true })
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
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(WarehouseEntity, "WHS");
    }
  }
}