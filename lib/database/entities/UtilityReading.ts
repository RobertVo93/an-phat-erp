import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Invoice } from "./Invoice";
import { UtilityType } from "../../../types/enums";
import type { Invoice as IInvoice } from "@/types/invoice";

@Entity({ name: "utility_readings" })
export class UtilityReading {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "enum", enum: UtilityType })
  utilityType!: UtilityType;

  @Column()
  utilityName!: string;

  @Column({ type: "float" })
  previousReading!: number;

  @Column({ type: "float" })
  currentReading!: number;

  @Column({ type: "float" })
  consumption!: number;

  @Column({ type: "float" })
  unitPrice!: number;

  @Column({ type: "float" })
  total!: number;

  @ManyToOne(() => Invoice, (invoice: Invoice) => invoice.readings)
  invoice!: IInvoice;
} 