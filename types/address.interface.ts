import { IBase } from "@/types/base.interface";

export interface IAddress extends IBase {
  name?: string;
  phone?: string;
  street?: string;
  ward?: string;
  city?: string;
  isDefault?: boolean;
}