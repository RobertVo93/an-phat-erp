import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { InvoiceEntity } from "./invoice.entity";
import type { Invoice as IInvoice } from "@/types/invoice";
import type { UtilityReading as IUtilityReading, Utility as IUtility } from "@/types"
import { ReadingType } from "@/types/enums"
import { BaseEntity } from "./base.entity";
import { UtilityEntity } from "./utility.entity";

@Entity({ name: "utility_readings" })
export class UtilityReading  extends BaseEntity implements IUtilityReading {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "enum", enum: ReadingType, nullable: false })
  utilityType!: ReadingType;

  @Column({ nullable: true })
  utilityName!: string;

  @Column({ type: "float" })
  consumption!: number;

  @Column({ type: "float" })
  unitPrice!: number;

  @Column({ type: "float" })
  total!: number;

  @ManyToOne(() => InvoiceEntity, (invoice: InvoiceEntity) => invoice.readings)
  invoice!: IInvoice;

  @ManyToOne(() => UtilityEntity, { nullable: true })
  @JoinColumn({ name: "utilityId" })
  utility!: IUtility;
} 