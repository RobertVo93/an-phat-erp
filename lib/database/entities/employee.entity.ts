import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";
import { BaseEntity } from "./base.entity";
import { EmployeeType, EmployeeStatus } from "../../../types/enums";
import { AttendanceRecordEntity } from "./attendance-record.entity";
import { AttendanceRecord as IAttendanceRecord } from "@/types/attendance";
import { Employee as IEmployee } from "@/types/employee";
import { PayrollRecordEntity } from "./payroll-record.entity";
import { PayrollRecord as IPayrollRecord } from "@/types";
import { ProductionLaborEntity } from "./production-labor.entity";
import type { ProductionLabor as IProductionLabor } from "@/types/ProductionLabor";
import { AppDataSource } from "../typeorm";

@Entity({ name: "employees" })
export class EmployeeEntity extends BaseEntity implements IEmployee {
  @Column({ unique: true})
  number?: string;

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

  @OneToMany(() => ProductionLaborEntity, (pl) => pl.employee, { cascade: true })
  productionLabors?: IProductionLabor[];

  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    const repo = AppDataSource.getRepository(EmployeeEntity);
    const latest = await repo
      .createQueryBuilder("record")
      .orderBy("CAST(SUBSTRING(record.number FROM 5) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.number
      ? parseInt(latest.number.replace("EMP-", ""), 10)
      : 0;

    this.number = `EMP-${String(lastNumber + 1).padStart(5, "0")}`;
  }
}
