import { Entity, Column, BeforeInsert } from "typeorm";
import { BaseEntity } from "./base.entity";
import { InvoiceStatus } from "@/types/enums";
import { IInvoiceUtility, Invoice as IInvoice } from "@/types";
import { CommonService } from "@/lib/services/commonService";

@Entity({ name: "invoices" })
export class InvoiceEntity extends BaseEntity implements IInvoice {
  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  billingPeriod?: string;

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

  @Column({ type: "jsonb", nullable: true })
  utilities?: IInvoiceUtility[];

  @Column({ type: "jsonb", nullable: true })
  utilityUsages?: IInvoiceUtility[];

  //////Auto numbering//////
  @BeforeInsert()
  async generateOrderNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(InvoiceEntity, "INV");
    }
  }
} 
