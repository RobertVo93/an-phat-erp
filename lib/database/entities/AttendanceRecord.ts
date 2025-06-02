import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "attendance_records" })
export class AttendanceRecord extends BaseEntity {
  @Column()
  employeeId!: string;

  @Column()
  employeeName!: string;

  @Column()
  date!: string;

  @Column({ nullable: true })
  checkIn?: string;

  @Column({ nullable: true })
  checkOut?: string;

  @Column({ type: "enum", enum: ["Morning", "Afternoon", "Evening"] })
  shift!: "Morning" | "Afternoon" | "Evening";

  @Column({ type: "enum", enum: ["Present", "Absent", "Late", "Half Day", "Overtime"] })
  status!: "Present" | "Absent" | "Late" | "Half Day" | "Overtime";

  @Column({ type: "float" })
  workHours!: number;

  @Column({ type: "float" })
  overtimeHours!: number;

  @Column({ type: "float" })
  dailyWage!: number;

  @Column({ nullable: true })
  notes?: string;
} 