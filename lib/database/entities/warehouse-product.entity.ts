import { WarehouseProduct } from '@/types/warehouseProduct';
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { WarehouseEntity } from "./warehouse.entity";
import { ProductEntity } from "./product.entity";
import type { Product as IProduct } from "@/types/product";
import type { Warehouse as IWarehouse } from "@/types/warehouse";

@Entity({ name: "warehouse_products" })
export class WarehouseProductEntity extends BaseEntity implements WarehouseProduct{
  @Column({ type: "float", nullable: false, default: 0 })
  quantity!: number;

  //////Related fields//////
  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.warehouseProducts, { nullable: false })
  @JoinColumn({ name: "warehouse_id" })
  warehouse!: IWarehouse;

  @ManyToOne(() => ProductEntity, (product) => product.warehouseProducts, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product!: IProduct;
}
