import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { AttendanceShift, AttendanceStatus } from "../../../types/enums";
import { EmployeeEntity } from "./employee.entity";
import type { Employee as IEmployee } from "@/types/employee";
import { AttendanceRecord as IAttendanceRecord } from "@/types/attendance";

@Entity({ name: "attendance_records" })
export class AttendanceRecordEntity extends BaseEntity implements IAttendanceRecord {
  @Column({ nullable: true })
  date?: string;

  @Column({ type: "timestamp", nullable: true })
  checkIn?: Date;

  @Column({ type: "timestamp", nullable: true })
  checkOut?: Date;

  @Column({ type: "enum", enum: AttendanceShift, nullable: true })
  shift?: AttendanceShift;

  @Column({ type: "enum", enum: AttendanceStatus, nullable: true })
  status?: AttendanceStatus;

  @Column({ type: "float", nullable: true })
  workHours?: number;

  @Column({ type: "float", nullable: true })
  overtimeHours?: number;

  @Column({ type: "float", nullable: true })
  dailyWage?: number;

  @Column({ nullable: true })
  notes?: string;

  //////Related fields//////
  @ManyToOne(() => EmployeeEntity, (employee: EmployeeEntity) => employee.attendanceRecords, { nullable: true })
  @JoinColumn({ name: "employee_id" })
  employee?: IEmployee;
}