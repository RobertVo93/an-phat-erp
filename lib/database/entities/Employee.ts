import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { EmployeeType, EmployeeStatus } from "../../../types/enums";
import { AttendanceRecord } from "./AttendanceRecord";
import { AttendanceRecord as IAttendanceRecord } from "@/types/attendance";

@Entity({ name: "employees" })
export class Employee extends BaseEntity {
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
  @OneToMany(() => AttendanceRecord, (attendance) => attendance.employee, { nullable: true })
  attendanceRecords!: IAttendanceRecord[];
} 