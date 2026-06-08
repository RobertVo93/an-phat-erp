import { Entity, Column, OneToMany, BeforeInsert, OneToOne, JoinColumn, Check } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { OrderEntity, UserEntity } from "@/lib/database/entities";
import { CustomerStatus, CustomerType } from "@/types/enums";
import type { Order as IOrder, Customer as ICustomer, IUser } from "@/types";
import { CommonService } from "@/lib/services/commonService";
import { AddressEntity } from "@/lib/database/entities";
import { IAddress } from "@/types";

@Entity({ name: "customers" })
@Check(`"id" = "user_id"`)
export class CustomerEntity extends BaseEntity implements ICustomer {
  @Column({ unique: true })
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

  @OneToOne(() => UserEntity, (user) => user.customer, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user?: IUser;

  @OneToMany(() => AddressEntity, (address) => address.customer, { cascade: true })
  addresses?: IAddress[]

  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(CustomerEntity, "CUS");
    }
  }
}
