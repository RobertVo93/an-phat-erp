import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { CustomerStatus, CustomerType } from "../../../types/enums";
import { Order } from "./Order";
import { Order as IOrder } from "@/types/order";

@Entity({ name: "customers" })
export class Customer extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: "int", nullable: true })
  totalOrders?: number;

  @Column({ type: "float", nullable: true })
  totalSpent?: number;

  @Column({ type: "timestamp", nullable: true })
  lastOrder?: Date;

  @Column({ type: "enum", enum: CustomerStatus, nullable: true })
  status?: CustomerStatus;

  @Column({ type: "enum", enum: CustomerType, nullable: true })
  customerType?: CustomerType;

  @Column({ type: "timestamp", nullable: true })
  joinDate?: Date;

  @Column({ nullable: true })
  notes?: string;

  //////Related fields//////
  @OneToMany(() => Order, (order) => order.customer, { nullable: true })
  orders!: IOrder[];
}