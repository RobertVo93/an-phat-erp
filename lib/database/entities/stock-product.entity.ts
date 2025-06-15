import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { StockChangeEntity } from "./stock-change.entity";
import type { StockChange as IStockChange } from "@/types/stock-change";
import { StockProduct as IStockProduct } from "@/types/stock-product";
import { ProductEntity } from "./product.entity";
import type { Product } from "@/types";

@Entity({ name: "stock_products" })
export class StockProductEntity extends BaseEntity implements IStockProduct {
  @Column({ type: "float", nullable: true })
  unitCost?: number;

  @Column({ type: "float", nullable: true })
  quantity?: number;

  @Column({ type: "float", nullable: true })
  totalCost?: number;

  //////Related fields//////
  @ManyToOne(() => StockChangeEntity, (stockChange: StockChangeEntity) => stockChange.stockProducts, { nullable: false })
  @JoinColumn({ name: "stock_change_id" })
  stockChange?: IStockChange;

  @ManyToOne(() => ProductEntity, (pro: ProductEntity) => pro.stockProducts, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product?: Product;
}