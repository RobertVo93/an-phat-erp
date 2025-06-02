import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "utilities" })
export class Utility extends BaseEntity {
  @Column()
  type!: string;

  @Column()
  provider!: string;

  @Column()
  accountNumber!: string;

  @Column()
  location!: string;

  @Column({ type: "float" })
  monthlyUsage!: number;

  @Column()
  unit!: string;

  @Column({ type: "float" })
  costPerUnit!: number;

  @Column({ type: "float" })
  monthlyCost!: number;

  @Column()
  lastReading!: string;

  @Column({ type: "enum", enum: ["Active", "Inactive", "Overdue", "Disconnected"] })
  status!: "Active" | "Inactive" | "Overdue" | "Disconnected";

  @Column()
  dueDate!: string;

  @Column({ nullable: true })
  description?: string;
} 