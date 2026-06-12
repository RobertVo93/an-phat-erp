import { Entity, Column, ManyToMany, JoinTable, BeforeInsert } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { ProductEntity } from "@/lib/database/entities";
import { CollectionStatus } from "@/types/enums";
import { Product as IProduct, Collection as ICollection } from "@/types";
import { CommonService } from "@/lib/services/commonService";

@Entity({ name: "collections" })
export class CollectionEntity extends BaseEntity implements ICollection {
  @Column({ unique: true})
  number?: string;

  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "enum", enum: CollectionStatus, nullable: true })
  status?: CollectionStatus;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: "boolean", default: false })
  saleable?: boolean;

  //////Related fields//////
  @ManyToMany(() => ProductEntity, (product: ProductEntity) => product.collections, { nullable: true })
  @JoinTable({ name: "collection_products" })
  products!: IProduct[];
  
  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(CollectionEntity, "COL");
    }
  }
} 