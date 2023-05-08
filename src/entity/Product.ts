import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Bedrijf } from "./Bedrijf";
import { BesteldProduct } from "./BesteldProduct";
import { Categorie } from "./Categorie";

@Entity({ name: "producten" })
export class Product {
  @PrimaryGeneratedColumn({ name: "ID" })
  productId: number;

  @ManyToOne(() => Bedrijf, (bedrijf) => bedrijf.products, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn({ name: "LEVERANCIER_ID" })
  bedrijf: Bedrijf;

  @ManyToOne(() => Categorie, (categorie) => categorie.producten, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn({ name: "categorie_id" })
  categorie: Categorie;

  @OneToMany(() => BesteldProduct, (besteldeProduct) => besteldeProduct.product)
  besteldeProducten: BesteldProduct[];

  @Column({ name: "NAAM", length: 255, unique: true })
  naam: string;

  @Column({ name: "EENHEIDSPRIJS", type: "double" })
  eenheidsprijs: number;

  @Column({ name: "voorraad", type: "int" })
  voorraad: number;

  @Column({
    name: "picture_filepath",
    length: 255,
  })
  pictureFilename: string;

  @Column({ name: "omschrijving", type: "text" })
  omschrijving: string;

  @Column({ name: "levertermijn", type: "int" })
  levertermijn: number;
}
