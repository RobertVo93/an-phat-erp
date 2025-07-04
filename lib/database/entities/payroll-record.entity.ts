import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { PayrollStatus } from "../../../types/enums";
import { PayrollRecord as IPayrollRecord } from "@/types/payroll";
import { EmployeeEntity } from "./employee.entity";
import type { Employee as IEmployee } from "@/types";

@Entity({ name: "payroll_records" })
export class PayrollRecordEntity extends BaseEntity implements IPayrollRecord {
  @Column({ type: "float" })
  bonus!: number;

  @Column({ type: "float" })
  deductions!: number;

  @Column({ type: "int" })
  workingShifts!: number;

  @Column({ nullable: false })
  payPeriod!: string;

  @Column({ type: "float" })
  totalSalary!: number;

  @Column({ type: "enum", enum: PayrollStatus })
  status!: PayrollStatus;

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({ nullable: true })
  notes?: string;

  // relations //
  @ManyToOne(() => EmployeeEntity, { nullable: false })
  @JoinColumn({ name: "employeeId" })
  employee?: IEmployee;
}