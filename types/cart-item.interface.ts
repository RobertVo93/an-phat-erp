import { IBase } from "./base.interface";
import { ICart } from "./cart.interface";
import { Product as IProduct } from "./product";

export interface ICartItem extends IBase {
    quantity?: number;
    price?: number;
    subtotal?: number;
    cart?: ICart;
    product?: IProduct;
}
