import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UtilityStatus } from "../../../types/enums";

@Entity({ name: "utilities" })
export class Utility extends BaseEntity {
  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  provider?: string;

  @Column({ nullable: true })
  accountNumber?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: "float", nullable: true })
  monthlyUsage?: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ type: "float", nullable: true })
  costPerUnit?: number;

  @Column({ type: "float", nullable: true })
  monthlyCost?: number;

  @Column({ nullable: true })
  lastReading?: string;

  @Column({ type: "enum", enum: UtilityStatus, nullable: true })
  status?: UtilityStatus;

  @Column({ nullable: true })
  dueDate?: string;

  @Column({ nullable: true })
  description?: string;
}