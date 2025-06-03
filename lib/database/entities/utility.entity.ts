import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UtilityStatus } from "../../../types/enums";
import { Utility as IUtility } from "@/types/utility";

@Entity({ name: "utilities" })
export class UtilityEntity extends BaseEntity implements IUtility {
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