import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { EmployeeType, EmployeeStatus } from "../../../types/enums";
import { AttendanceRecordEntity } from "./attendance-record.entity";
import { AttendanceRecord as IAttendanceRecord } from "@/types/attendance";
import { Employee as IEmployee } from "@/types/employee";
import { PayrollRecordEntity } from "./payroll-record.entity";
import { PayrollRecord as IPayrollRecord} from "@/types";

@Entity({ name: "employees" })
export class EmployeeEntity extends BaseEntity implements IEmployee {
  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: false })
  phone?: string;

  @Column({ nullable: true })
  position?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ type: "float", nullable: true })
  salary?: number;

  @Column({ type: "timestamp", nullable: true })
  hireDate?: Date;

  @Column({ type: "enum", enum: EmployeeType, nullable: true })
  employeeType?: EmployeeType;

  @Column({ type: "enum", enum: EmployeeStatus, nullable: true })
  status?: EmployeeStatus;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  emergencyContact?: string;

  @Column({ nullable: true })
  notes?: string;

  //////Related fields//////
  @OneToMany(() => AttendanceRecordEntity, (attendance) => attendance.employee, { nullable: true })
  attendanceRecords!: IAttendanceRecord[];

  @OneToMany(() => PayrollRecordEntity, (payroll) => payroll.employee, { nullable: true })
  payrollRecords?: IPayrollRecord[];
}
 