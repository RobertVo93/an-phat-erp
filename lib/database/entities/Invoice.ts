import { Entity, Column, OneToMany } from "typeorm";
import { UtilityReading } from "./UtilityReading";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "invoices" })
export class Invoice extends BaseEntity {
  @Column()
  invoiceNumber!: string;

  @Column()
  propertyId!: string;

  @Column()
  propertyName!: string;

  @Column()
  propertyAddress!: string;

  @Column()
  tenantName!: string;

  @Column()
  tenantPhone!: string;

  @Column()
  tenantEmail!: string;

  @Column()
  billingPeriod!: string;

  @Column()
  issueDate!: string;

  @Column()
  dueDate!: string;

  @OneToMany(() => UtilityReading, (reading: UtilityReading) => reading.invoice, { cascade: true })
  readings!: UtilityReading[];

  @Column({ type: "float" })
  subtotal!: number;

  @Column({ type: "float" })
  taxRate!: number;

  @Column({ type: "float" })
  taxAmount!: number;

  @Column({ type: "float" })
  otherFees!: number;

  @Column()
  otherFeesDescription!: string;

  @Column({ type: "float" })
  total!: number;

  @Column({ type: "float" })
  paidAmount!: number;

  @Column({ type: "enum", enum: ["draft", "sent", "paid", "partial", "overdue", "cancelled"] })
  status!: "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled";

  @Column()
  notes!: string;
} 