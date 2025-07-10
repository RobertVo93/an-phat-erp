import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";
import { UtilityReading } from "./utility-reading.entity";
import { BaseEntity } from "./base.entity";
import { InvoiceStatus } from "../../../types/enums";
import { UtilityReading as IUtilityReading } from "@/types/invoice";
import { Invoice as IInvoice } from "@/types/invoice";
import { AppDataSource } from "../typeorm";

@Entity({ name: "invoices" })
export class InvoiceEntity extends BaseEntity implements IInvoice {
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

  @Column({ type: "enum", enum: InvoiceStatus, nullable: true })
  status?: InvoiceStatus;

  @Column({ nullable: true })
  notes?: string;

  //////Related fields//////
  @OneToMany(() => UtilityReading, (reading: UtilityReading) => reading.invoice, { nullable: true })
  readings!: IUtilityReading[];

  //////Auto numbering//////
  @BeforeInsert()
  async generateOrderNumber() {
    const repo = AppDataSource.getRepository(InvoiceEntity);
    const latest = await repo
      .createQueryBuilder("invoice")
      .orderBy("CAST(SUBSTRING(invoice.invoiceNumber FROM 5) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.invoiceNumber
      ? parseInt(latest.invoiceNumber.replace("UTL-", ""), 10)
      : 0;

    this.invoiceNumber = `UTL-${lastNumber + 1}`;
  }
} 