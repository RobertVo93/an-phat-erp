import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import type { IAddress, Customer as ICustomer } from "@/types";
import { CustomerEntity } from "@/lib/database/entities";

@Entity({ name: "addresses" })
export class AddressEntity extends BaseEntity implements IAddress {
  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: false })
  phone?: string;

  @Column({ nullable: false })
  street?: string;

  @Column({ nullable: false })
  ward?: string;

  @Column({ nullable: false })
  city?: string;

  @Column({ default: false, nullable: false })
  isDefault?: boolean;

  @ManyToOne(() => CustomerEntity, (customer) => customer.addresses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "customer_id" })
  customer!: ICustomer;
}
