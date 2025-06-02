import { Entity, Column, OneToMany } from "typeorm";
import { UtilityReading } from "./UtilityReading";
import { BaseEntity } from "./BaseEntity";
import { InvoiceStatus } from "../../../types/enums";

@Entity({ name: "invoices" })
export class Invoice extends BaseEntity {
  @Column({ nullable: true })
  invoiceNumber?: string;

  @Column({ type: "timestamp", nullable: true })
  billingPeriod?: Date;

  @Column({ type: "timestamp", nullable: true })
  issueDate?: Date;

  @Column({ type: "timestamp", nullable: true })
  dueDate?: Date;

  @Column({ type: "float", nullable: true })
  subtotal?: number;

  @Column({ type: "float", nullable: true })
  taxRate?: number;

  @Column({ type: "float", nullable: true })
  taxAmount?: number;

  @Column({ type: "float", nullable: true })
  otherFees?: number;

  @Column({ nullable: true })
  otherFeesDescription?: string;

  @Column({ type: "float", nullable: true })
  total?: number;

  @Column({ type: "float", nullable: true })
  paidAmount?: number;

  @Column({ type: "enum", enum: InvoiceStatus, nullable: true })
  status?: InvoiceStatus;

  @Column({ nullable: true })
  notes?: string;


  //////Related fields//////
  @OneToMany(() => UtilityReading, (reading: UtilityReading) => reading.invoice, { nullable: true })
  readings!: UtilityReading[];
} 