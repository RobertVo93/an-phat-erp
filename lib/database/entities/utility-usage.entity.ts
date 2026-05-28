import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { UtilityUsageStatus, UtilityUnit } from "@/types/enums";
import type { IUser, Utility, IUtilityUsage } from "@/types";
import { CommonService } from "@/lib/services/commonService";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { UtilityEntity } from "@/lib/database/entities/utility.entity";

@Entity({ name: "utility_usage" })
export class UtilityUsageEntity extends BaseEntity implements IUtilityUsage {
  @Column({ unique: true, nullable: true })
  number?: string;

  @Column({ type: "timestamp", nullable: true })
  usageTime?: Date;

  @Column({ type: "enum", enum: UtilityUnit, nullable: true })
  unit?: UtilityUnit;

  @Column({ type: "float", nullable: true })
  amountBefore?: number;

  @Column({ type: "float", nullable: true })
  amountAfter?: number;

  @Column({ type: "float", nullable: true })
  totalUsage?: number;

  @Column({ type: "enum", enum: UtilityUsageStatus, nullable: false, default: UtilityUsageStatus.draft })
  status?: UtilityUsageStatus;

  @Column({ nullable: true })
  note?: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.recordedUtilityUsages, { nullable: true })
  @JoinColumn({ name: "recorder_id" })
  recorder?: IUser;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.approvedUtilityUsages, { nullable: true })
  @JoinColumn({ name: "approver_id" })
  approver?: IUser;

  @ManyToOne(() => UtilityEntity, (utility: UtilityEntity) => utility.usages, { nullable: true })
  @JoinColumn({ name: "utility_id" })
  utility?: Utility;

  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(UtilityUsageEntity, "UUS");
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  syncDerivedFields() {
    if (this.amountAfter !== undefined && this.amountBefore !== undefined) {
      this.totalUsage = this.amountAfter - this.amountBefore;
    }

    if (!this.unit && this.utility?.unit) {
      this.unit = this.utility.unit;
    }

    if (!this.recorder && this.createdBy) {
      this.recorder = { id: this.createdBy } as IUser;
    }
  }
}
