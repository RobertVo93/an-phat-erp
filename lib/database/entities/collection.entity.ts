import { Entity, Column, ManyToMany, JoinTable, BeforeInsert } from "typeorm";
import { ProductEntity } from "./product.entity";
import { BaseEntity } from "./base.entity";
import { CollectionStatus } from "../../../types/enums";
import { Product as IProduct } from "@/types/product";
import { Collection as ICollection } from "@/types/collection";
import { AppDataSource } from "../typeorm";

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

  //////Related fields//////
  @ManyToMany(() => ProductEntity, (product: ProductEntity) => product.collections, { nullable: true })
  @JoinTable({ name: "collection_products" })
  products!: IProduct[];
  
  //////Auto numbering//////
  @BeforeInsert()
  async generateNumber() {
    const repo = AppDataSource.getRepository(CollectionEntity);
    const latest = await repo
      .createQueryBuilder("record")
      .orderBy("CAST(SUBSTRING(record.number FROM 5) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.number
      ? parseInt(latest.number.replace("COL-", ""), 10)
      : 0;

    this.number = `COL-${String(lastNumber + 1).padStart(5, "0")}`;
  }
} 