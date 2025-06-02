import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "production_records" })
export class ProductionRecord extends BaseEntity {
  @Column()
  date!: string;

  @Column()
  product!: string;

  @Column({ type: "int" })
  quantity!: number;

  @Column()
  unit!: string;

  @Column({ type: "enum", enum: ["completed", "in-progress", "paused", "cancelled"] })
  status!: "completed" | "in-progress" | "paused" | "cancelled";

  @Column()
  statusText!: string;

  @Column()
  shift!: string;

  @Column()
  operator!: string;

  @Column({ type: "jsonb" })
  rawMaterials!: Array<{ name: string; quantity: number; unit: string; cost: number }>;

  @Column({ type: "jsonb" })
  utilities!: Array<{ name: string; quantity: number; unit: string; cost: number }>;

  @Column({ type: "jsonb" })
  labor!: { hours: number; workers: number; cost: number };

  @Column({ type: "float" })
  totalCost!: number;

  @Column({ type: "float" })
  efficiency!: number;
} 