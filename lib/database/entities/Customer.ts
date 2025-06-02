import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "customers" })
export class Customer extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  company?: string;

  @Column()
  location!: string;

  @Column({ type: "int" })
  totalOrders!: number;

  @Column()
  totalSpent!: string;

  @Column()
  lastOrder!: string;

  @Column({ type: "enum", enum: ["Active", "Inactive", "Pending"] })
  status!: "Active" | "Inactive" | "Pending";

  @Column({ type: "enum", enum: ["VIP", "Premium", "Regular"] })
  customerType!: "VIP" | "Premium" | "Regular";

  @Column()
  joinDate!: string;

  @Column({ nullable: true })
  notes?: string;
} 