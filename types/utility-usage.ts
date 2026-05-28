import { IBase, IBaseFilters } from "@/types/base.interface";
import { UtilityUnit, UtilityUsageStatus } from "@/types/enums";
import type { Utility } from "@/types/utility";
import type { IUser } from "@/types/user";

export interface IUtilityUsage extends IBase {
  id?: string;
  number?: string;
  usageTime?: Date;
  unit?: UtilityUnit;
  amountBefore?: number;
  amountAfter?: number;
  totalUsage?: number;
  status?: UtilityUsageStatus;
  note?: string;
  recorder?: IUser;
  approver?: IUser;
  utility?: Utility;
}

export interface IUtilityUsageFilters extends IBaseFilters {
  searchTerm?: string;
  status?: string;
  periodStart?: Date;
  periodEnd?: Date;
  utilityId?: string;
  recorderId?: string;
  approverId?: string;
}

export type UtilityUsageSortableKey = "number" | "amountBefore" | "amountAfter" | "totalUsage" | "status" | "usageTime";
