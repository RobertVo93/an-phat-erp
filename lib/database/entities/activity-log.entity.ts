import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ResourceType, IActivityLog } from "@/types";

@Entity({ name: "activity_logs" })
export class ActivityLogEntity extends BaseEntity implements IActivityLog {
  @Column({ type: "enum", enum: ResourceType, nullable: true })
  resource?: ResourceType;

  @Column({ nullable: true })
  targetId?: string; // for Ex: order id, product id, customer id, employee id, warehouse id, collection id

  @Column({ nullable: true })
  field?: string; // field name. for Ex: "Status", "Payment Method"

  @Column({ type: "jsonb", nullable: true })
  oldValue?: Record<string, any>;

  @Column({ type: "jsonb", nullable: true })
  newValue?: Record<string, any>;

  @Column({ nullable: true })
  updatedUser?: string; // user full name. for Ex: "Vo An"

  @Column({ nullable: true })
  transactionId?: string; // if 2 fields change at the same time, we need to use this field to identify the transaction
}
