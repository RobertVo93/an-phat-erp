import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "payroll_records" })
export class PayrollRecord extends BaseEntity {
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

  @Column({ type: "enum", enum: ["Processed", "Pending", "Failed"] })
  status!: "Processed" | "Pending" | "Failed";

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