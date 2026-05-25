import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { AppDataSource } from "@/lib/database/typeorm";
import { StockChangeType, StockChangeStatus } from "@/types/enums";
import type { Warehouse as IWarehouse, ProductionRecord as IProductionRecord } from "@/types";
import { StockChange as IStockChange, IStockProduct } from "@/types";
import { WarehouseEntity, ProductEntity, WarehouseProductEntity, ProductionRecordEntity } from "@/lib/database/entities";
import { CommonService } from "@/lib/services/commonService";

@Entity({ name: "stock_change" })
export class StockChangeEntity extends BaseEntity implements IStockChange {
  @Column({ unique: true })
  number?: string;

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
  supplier?: string;

  @Column({ type: "jsonb", nullable: true })
  stockProducts?: IStockProduct[];

  //////Related fields//////
  @ManyToOne(() => WarehouseEntity, (warehouse: WarehouseEntity) => warehouse.stockChanges, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: IWarehouse;

  @ManyToOne(() => ProductionRecordEntity, (pr) => pr.stockChanges, { nullable: true })
  @JoinColumn({ name: "production_record_id" })
  productionRecord?: IProductionRecord;


  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(StockChangeEntity, "STC");
    }

    if (this.status === StockChangeStatus.completed) {
      await this.handleCompletedStockChange();
    }
  }

  @BeforeUpdate()
  async handleStatusCompleted() {
    if (this.status === StockChangeStatus.completed) {
      await this.handleCompletedStockChange();
    }
  }

  /**
   * Handle logic when the stock change record is completed
   */
  async handleCompletedStockChange() {
    this.receivedDate = new Date();

    // Use a transaction so all stockProduct updates are atomic
    await AppDataSource.transaction(async (manager) => {
      if (!this.warehouse || !this.stockProducts) {
        throw new Error("Warehouse or stock products not defined");
      }
      const warehouseProductRepo = manager.getRepository(WarehouseProductEntity);
      const productRepo = manager.getRepository(ProductEntity);

      for (const stockProduct of this.stockProducts) {
        if (!stockProduct.id || !stockProduct.quantity) continue;

        // Find the product
        const product = await productRepo.findOneOrFail({ where: { id: stockProduct.id } });
        // Find the warehouse product
        let warehouseProduct = await warehouseProductRepo.findOne({
          where: {
            warehouse: { id: this.warehouse.id },
            product: { id: stockProduct.id }
          },
        });

        let newWarehouseQty = 0;
        let newProductQty = 0;
        if (this.type === StockChangeType.stockIn) {
          // Stock In: add quantity
          newWarehouseQty = (warehouseProduct?.quantity || 0) + (stockProduct.quantity || 0);
          if (warehouseProduct) {
            warehouseProduct.quantity = newWarehouseQty;
            await warehouseProductRepo.save(warehouseProduct);
          } else {
            // Create new warehouse product
            warehouseProduct = warehouseProductRepo.create({
              warehouse: this.warehouse,
              product: product,
              quantity: stockProduct.quantity
            });
            await warehouseProductRepo.save(warehouseProduct);
          }
          newProductQty = (product.stock || 0) + (stockProduct.quantity || 0);
        } else if (this.type === StockChangeType.stockOut) {
          // Stock Out: subtract quantity
          newWarehouseQty = (warehouseProduct?.quantity || 0) - (stockProduct.quantity || 0);
          if (newWarehouseQty < 0) {
            throw new Error(`Insufficient stock for product: ${stockProduct.sku} in warehouse`);
          }
          if (newWarehouseQty === 0) {
            await warehouseProductRepo.remove(warehouseProduct!);
          } else {
            warehouseProduct!.quantity = newWarehouseQty;
            await warehouseProductRepo.save(warehouseProduct!);
          }
          newProductQty = (product.stock || 0) - (stockProduct.quantity || 0);
        }

        // update Product quantity
        if (newProductQty < 0) {
          throw new Error(`Insufficient total stock for product: ${stockProduct.sku}`);
        }
        product.stock = newProductQty;
        await productRepo.save(product);
      }
    });
  }
}