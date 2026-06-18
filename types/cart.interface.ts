import { IBase } from "./base.interface";
import { ICartItem } from "./cart-item.interface";

export interface ICart extends IBase {
    userId?: string;
    totalQuantity?: number;
    totalPrice?: number;
    items?: ICartItem[];
}
