import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { WarehouseEntity } from "./warehouse.entity";
import { ProductEntity } from "./product.entity";
import type { Product as IProduct, Warehouse as IWarehouse } from "@/types";
import { WarehouseProduct } from '@/types';

@Entity({ name: "warehouse_products" })
export class WarehouseProductEntity extends BaseEntity implements WarehouseProduct{
  @Column({ type: "float", nullable: false, default: 0 })
  quantity!: number;

  //////Related fields//////
  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.warehouseProducts, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse!: IWarehouse;

  @ManyToOne(() => ProductEntity, (product) => product.warehouseProducts, { nullable: true })
  @JoinColumn({ name: "product_id" })
  product!: IProduct;
}
