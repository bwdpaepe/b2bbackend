import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Product } from "./Product";
import { Bedrijf } from "./Bedrijf";

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

  @ManyToMany(() => Bedrijf, (bedrijf) => bedrijf.categorie)
  bedrijven: Bedrijf[];
}
