import { IBase } from "@/types/base.interface";
import { ResourceType } from "@/types";

export interface IActivityLog extends IBase {
  resource?: ResourceType;
  targetId?: string;
  field?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  updatedUser?: string;
  transactionId?: string;
}

export interface IChangeLog {
  field: string;
  oldValue: any;
  newValue: any;
}