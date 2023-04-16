import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { Bedrijf } from "./Bedrijf";

@Entity({ name: "product" })
export class Product {
  @PrimaryGeneratedColumn({ name: "ID" })
  productId: number;

  @ManyToOne(() => Bedrijf, (bedrijf) => bedrijf.products)
  bedrijf: Bedrijf;

  @Column({ name: "NAAM", length: 255, unique: true })
  naam: string;

  @Column({ name: "EENHEIDSPRIJS", type: "double" })
  eenheidsprijs: number;

  //TODO - nog toevoegen in DB: afbeelding product

  /*@Column({
    name: "AFBEELDING_FILENAME",
    length: 255,
  })
  logoFilename: string;*/
}
