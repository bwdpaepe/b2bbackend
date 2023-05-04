import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity({ name: "categorie" })
export class Categorie {
  @PrimaryGeneratedColumn({ name: "id" })
  categoryId: number;

  @Column({ name: "naam", length: 255, unique: true })
  naam: string;

  @OneToMany(() => Product, (product) => product.categorie, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  producten: Product[];
}
