import { Employee } from "./employee";
import { ProductionRecord } from "./production";

export interface ProductionLabor {
  id?: string;
  productionRecord?: ProductionRecord;
  employee?: Employee;
}
