import { Entity, Column, BeforeInsert, OneToMany } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { UtilityStatus, UtilityUnit } from "@/types/enums";
import { Utility as IUtility, IUtilityUsage } from "@/types";
import { CommonService } from "@/lib/services/commonService";
import { UtilityUsageEntity } from "@/lib/database/entities/utility-usage.entity";

@Entity({ name: "utilities" })
export class UtilityEntity extends BaseEntity implements IUtility {
  @Column({ unique: true })
  number?: string;

  @Column({ nullable: false })
  name?: string

  @Column({ nullable: true })
  provider?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: "enum", enum: UtilityUnit, nullable: true })
  unit?: UtilityUnit;

  @Column({ type: "float", nullable: true })
  costPerUnit?: number;

  @Column({ type: "enum", enum: UtilityStatus, nullable: true })
  status?: UtilityStatus;

  @Column({ nullable: true })
  description?: string;

  ///Relation fields
  @OneToMany(() => UtilityUsageEntity, (usage) => usage.utility, { nullable: true })
  usages?: IUtilityUsage[];

  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(UtilityEntity, "UTL");
    }
  }
}
