import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { EmployeeEntity } from "@/lib/database/entities";
import { AttendanceShift, AttendanceStatus, AttendanceSubStatus } from "@/types/enums";
import type { Employee as IEmployee } from "@/types";
import { AttendanceRecord as IAttendanceRecord } from "@/types";
import { CommonService } from "@/lib/services/commonService";

@Entity({ name: "attendance_records" })
export class AttendanceRecordEntity extends BaseEntity implements IAttendanceRecord {
  @Column({ unique: true})
  number?: string;

  @Column({ nullable: true })
  date?: Date;

  @Column({ type: "timestamp", nullable: true })
  checkIn?: Date;

  @Column({ type: "timestamp", nullable: true })
  checkOut?: Date;

  @Column({ type: "enum", enum: AttendanceShift, nullable: true })
  shift?: AttendanceShift;

  @Column({ type: "enum", enum: AttendanceStatus, nullable: true })
  status?: AttendanceStatus;

  @Column({ type: "enum", enum: AttendanceSubStatus, nullable: true })
  subStatus?: AttendanceSubStatus;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  workHours?: number;

  @Column({ nullable: true })
  paidAmount?: number;

  //////Related fields//////
  @ManyToOne(() => EmployeeEntity, (employee: EmployeeEntity) => employee.attendanceRecords, { nullable: true })
  @JoinColumn({ name: "employee_id" })
  employee?: IEmployee;
  
  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber("AttendanceRecordEntity", "ATD");
    }
  }
}