import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "employees" })
export class Employee extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  position!: string;

  @Column()
  department!: string;

  @Column()
  salary!: string;

  @Column()
  hireDate!: string;

  @Column({ type: "enum", enum: ["Full-time", "Part-time", "Contract", "Intern"] })
  employeeType!: "Full-time" | "Part-time" | "Contract" | "Intern";

  @Column({ type: "enum", enum: ["Active", "Inactive", "On Leave"] })
  status!: "Active" | "Inactive" | "On Leave";

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  emergencyContact?: string;

  @Column({ nullable: true })
  notes?: string;
} 