import { Entity, Column, OneToMany } from "typeorm";
import { CartItemEntity } from "./cart-item.entity";
import { BaseEntity } from "./base.entity";
import type { ICart, ICartItem } from "@/types";

@Entity({ name: "carts" })
export class CartEntity extends BaseEntity implements ICart {
    @Column({ name: "user_id", nullable: true })
    userId?: string;

    @Column({ name: "total_quantity", type: "int", default: 0 })
    totalQuantity?: number;

    @Column({ name: "total_price", type: "float", default: 0 })
    totalPrice?: number;

    @OneToMany(() => CartItemEntity, item => item.cart, { cascade: true })
    items?: ICartItem[];
}
