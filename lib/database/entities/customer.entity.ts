import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { OrderEntity } from "@/lib/database/entities";
import { CustomerStatus, CustomerType } from "@/types/enums";
import { Order as IOrder, Customer as ICustomer } from "@/types";
import { CommonService } from "@/lib/services/commonService";

@Entity({ name: "customers" })
export class CustomerEntity extends BaseEntity implements ICustomer {
  @Column({ unique: true})
  number?: string;

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
  @OneToMany(() => OrderEntity, (order) => order.customer, { nullable: true })
  orders!: IOrder[];

  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(CustomerEntity, "CUS");
    }
  }
}