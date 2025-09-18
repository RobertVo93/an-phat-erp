import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { EmployeeEntity } from "@/lib/database/entities";
import { PayrollStatus } from "@/types/enums";
import { PayrollRecord as IPayrollRecord, AttendanceRecord as IAttendanceRecord } from "@/types";
import type { Employee as IEmployee } from "@/types";
import { CommonService } from "@/lib/services/commonService";

@Entity({ name: "payroll_records" })
export class PayrollRecordEntity extends BaseEntity implements IPayrollRecord {
  @Column({ unique: true })
  number?: string;

  @Column({ type: "float", nullable: true })
  baseSalary?: number;

  @Column({ type: "float", nullable: true })
  bonus?: number;

  @Column({ type: "float", nullable: true })
  deductions?: number;

  @Column({ type: "float", nullable: true })
  totalSalary?: number;

  @Column({ type: "int", nullable: true })
  workingShifts?: number;

  @Column({ type: "float", nullable: true })
  workingHours?: number;

  @Column({ nullable: false })
  payPeriod?: string;

  @Column({ type: "enum", enum: PayrollStatus, default: PayrollStatus.draft })
  status?: PayrollStatus;

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: "jsonb", nullable: true })
  attendanceRecords?: IAttendanceRecord[];

  // relations //
  @ManyToOne(() => EmployeeEntity, { nullable: false })
  @JoinColumn({ name: "employeeId" })
  employee?: IEmployee;
  
  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber("PayrollRecordEntity", "PAY");
    }
  }
}