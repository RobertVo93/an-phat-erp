import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CartEntity, ProductEntity } from "@/lib/database/entities";
import { BaseEntity } from "@/lib/database/entities/base.entity";

@Entity({ name: "cart_items" })
export class CartItemEntity extends BaseEntity {
    @Column({ type: "int", default: 1 })
    quantity?: number;

    @Column({ type: "float", default: 0 })
    price?: number;

    @Column({ type: "float", default: 0 })
    subtotal?: number;

    @ManyToOne(() => CartEntity, cart => cart.items)
    @JoinColumn({ name: "cart_id" })
    cart?: CartEntity;

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: "product_id" })
    product?: ProductEntity;
} 