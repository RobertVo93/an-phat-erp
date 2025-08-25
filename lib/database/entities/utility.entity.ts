import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UtilityStatus, UtilityType, UtilityUnit } from "../../../types/enums";
import { Utility as IUtility } from "@/types/utility";

@Entity({ name: "utilities" })
export class UtilityEntity extends BaseEntity implements IUtility {
  @Column({ type: "enum", enum: UtilityType, nullable: true })
  type?: UtilityType;

  @Column({ nullable: false })
  name?: string

  @Column({ nullable: true })
  provider?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: "enum", enum: UtilityUnit, nullable: true })
  unit?: UtilityUnit;

  @Column({ type: "float", nullable: true })
  costPerUnit?: number;

  @Column({ type: "enum", enum: UtilityStatus, nullable: true })
  status?: UtilityStatus;

  @Column({ nullable: true })
  description?: string;
}