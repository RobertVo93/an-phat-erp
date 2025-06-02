import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { AttendanceShift, AttendanceStatus } from "../../../types/enums";
import { Employee } from "./Employee";
import type { Employee as IEmployee } from "@/types/employee";

@Entity({ name: "attendance_records" })
export class AttendanceRecord extends BaseEntity {
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
  @ManyToOne(() => Employee, (employee: Employee) => employee.attendanceRecords, { nullable: true })
  @JoinColumn({ name: "employee_id" })
  employee?: IEmployee;
}