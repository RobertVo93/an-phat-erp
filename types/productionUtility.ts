import { Utility } from "./utility";

export interface ProductionUtility {
  id?: string;
  productionRecordId?: string;
  utility?: Utility;
  quantity?: number;
  unit?: string;
  cost?: number;
}