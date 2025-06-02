import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Invoice } from "./Invoice";

@Entity({ name: "utility_readings" })
export class UtilityReading {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "enum", enum: ["electricity", "water", "gas", "internet", "other"] })
  utilityType!: "electricity" | "water" | "gas" | "internet" | "other";

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
  invoice!: Invoice;
} 