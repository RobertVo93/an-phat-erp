import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";
import { PayrollStatus } from "../../../types/enums";
import { PayrollRecord as IPayrollRecord } from "@/types/payroll";

@Entity({ name: "payroll_records" })
export class PayrollRecordEntity extends BaseEntity implements IPayrollRecord {
  @Column()
  employeeId!: string;

  @Column()
  name!: string;

  @Column()
  department!: string;

  @Column()
  position!: string;

  @Column({ type: "float" })
  baseSalary!: number;

  @Column({ type: "float" })
  overtime!: number;

  @Column({ type: "float" })
  bonus!: number;

  @Column({ type: "float" })
  deductions!: number;

  @Column({ type: "float" })
  netSalary!: number;

  @Column({ type: "enum", enum: PayrollStatus })
  status!: PayrollStatus;

  @Column()
  payPeriod!: string;

  @Column({ type: "int" })
  workingDays!: number;

  @Column({ type: "float" })
  overtimeHours!: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  processedDate?: string;
} 