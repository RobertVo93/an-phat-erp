import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CustomerStatus, CustomerType } from "../../../types/enums";
import { OrderEntity } from "./order.entity";
import { Order as IOrder } from "@/types/order";
import { Customer as ICustomer } from "@/types/customer";
import { AppDataSource } from "../typeorm";

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
    const repo = AppDataSource.getRepository(CustomerEntity);
    const latest = await repo
      .createQueryBuilder("record")
      .orderBy("CAST(SUBSTRING(record.number FROM 5) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.number
      ? parseInt(latest.number.replace("CUS-", ""), 10)
      : 0;

    this.number = `CUS-${String(lastNumber + 1).padStart(5, "0")}`;
  }
}