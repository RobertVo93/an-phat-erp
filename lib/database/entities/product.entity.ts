import { Entity, Column, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductStatus } from "../../../types/enums";
import { CollectionEntity } from "./collection.entity";
import { OrderItemEntity } from "./order-item.entity";
import { Collection as ICollection } from "@/types/collection";
import { OrderItem as IOrderItem } from "@/types/order";
import { Product as IProduct } from "@/types/product";
import { WarehouseProductEntity } from "./warehouse-product.entity";
import { WarehouseProduct as IWarehouseProduct } from "@/types/warehouseProduct";
import { StockProductEntity } from "./stock-product.entity";
import type { StockProduct as IStockProduct} from "@/types/stock-product";

@Entity({ name: "products" })
export class ProductEntity extends BaseEntity implements IProduct {
  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "float", nullable: true })
  price?: number;

  @Column({ type: "float", nullable: true })
  cost?: number;

  @Column({ type: "int", nullable: true })
  stock?: number;

  @Column({ type: "int", nullable: true })
  minStock?: number;

  @Column({ nullable: true })
  sku?: string;

  @Column({ nullable: true })
  barcode?: string;

  @Column({ type: "enum", enum: ProductStatus, nullable: true })
  status?: ProductStatus;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ nullable: true })
  image?: string;

  //////Related fields//////
  @ManyToMany(() => CollectionEntity, (collection) => collection.products, { nullable: true })
  collections?: ICollection[];

  @OneToMany(() => OrderItemEntity, (item: OrderItemEntity) => item.product, { nullable: true })
  orderItems?: IOrderItem[];

  @OneToMany(() => StockProductEntity, (sp) => sp.product, { nullable: true })
  stockProducts?: IStockProduct[];

  @OneToMany(() => WarehouseProductEntity, (wp) => wp.product, { nullable: true })
  warehouseProducts?: IWarehouseProduct[];
} 