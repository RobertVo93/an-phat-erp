import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./base.entity";
import { AppDataSource } from "@/lib/database/typeorm";
import { CustomerEntity } from "./customer.entity";
import { WarehouseEntity } from "./warehouse.entity";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@/types/enums";
import { IOrderItem, Order as IOrder } from "@/types";
import type { Warehouse as IWarehouse, Customer as ICustomer } from "@/types";
import { CommonService } from "@/lib/services/commonService";
import { handleCompleteOrder, handleOrderChangeLogs } from "@/lib/services/orderService";

@Entity({ name: "orders" })
export class OrderEntity extends BaseEntity implements IOrder {
  @Column({ unique: true })
  number?: string;

  @Column({ type: "timestamp", nullable: true })
  deliveryDate?: Date;

  @Column({ type: "float", nullable: true })
  totalAmount?: number;

  @Column({ type: "enum", enum: OrderStatus, nullable: true })
  status?: OrderStatus;

  @Column({ type: "enum", enum: PaymentStatus, nullable: true })
  paymentStatus?: PaymentStatus;

  @Column({ type: "enum", enum: PaymentMethod, nullable: true })
  paymentMethod?: PaymentMethod;

  @Column({ nullable: true })
  shippingAddress?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column("text", { array: true, nullable: true })
  tags?: string[];

  @Column({ type: "float", nullable: true })
  shippingFee?: number;

  @Column({ type: "float", nullable: true })
  tax?: number;

  @Column({ type: "jsonb", nullable: true })
  items!: IOrderItem[];

  @Column({ type: "jsonb", nullable: true })
  receiverInfo?: {
    name?: string;
    phone?: string;
  };

  //////Related fields//////
  @ManyToOne(() => CustomerEntity, (customer: CustomerEntity) => customer.orders, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer?: ICustomer;

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.orders, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: IWarehouse;

  //////Auto order numbering//////
  @BeforeInsert()
  async generateOrderNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(OrderEntity, "ORD");
    }
    if (this.status === OrderStatus.completed) {
      handleCompleteOrder(this);
    }
  }

  @BeforeUpdate()
  async updateOrder() {
    if (this.status === OrderStatus.completed) {
      handleCompleteOrder(this);
    }

    const repo = AppDataSource.getRepository(OrderEntity);
    // get data before update
    const previous = await repo.findOne({
      where: { id: this.id },
      relations: ["customer", "warehouse"],
    });

    handleOrderChangeLogs(previous!, this);
  }
}
