import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "warehouses" })
export class Warehouse extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  location!: string;

  @Column()
  address!: string;

  @Column()
  manager!: string;

  @Column({ type: "int" })
  capacity!: number;

  @Column({ type: "int" })
  occupied!: number;

  @Column({ type: "enum", enum: ["Active", "Maintenance", "Inactive"] })
  status!: "Active" | "Maintenance" | "Inactive";

  @Column({ type: "enum", enum: ["Distribution Center", "Regional Hub", "Cold Storage", "Backup Storage"] })
  type!: "Distribution Center" | "Regional Hub" | "Cold Storage" | "Backup Storage";

  @Column({ type: "int" })
  zones!: number;

  @Column({ type: "enum", enum: ["Ambient", "Refrigerated", "Frozen"] })
  temperature!: "Ambient" | "Refrigerated" | "Frozen";

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  description?: string;
} 