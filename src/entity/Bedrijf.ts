import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity({ name: "BEDRIJF" })
export class Bedrijf {
  @PrimaryGeneratedColumn({ name: "ID" })
  bedrijfId: number;

  @OneToMany(() => User, (user) => user.bedrijf)
  users: User[];

  @OneToMany(() => Product, (product) => product.bedrijf)
  products: Product[];

  @Column({
    name: "NAAM",
    length: 255,
    unique: true,
  })
  naam: string;

  @Column({
    name: "LOGO_FILENAME",
    length: 255,
  })
  logoFilename: string;

  @Column({
    name: "STRAAT",
    length: 255,
  })
  straat: string;

  @Column({
    name: "HUISNUMMER",
    length: 255,
  })
  huisnummer: string;

  @Column({
    name: "POSTCODE",
    length: 255,
  })
  postcode: string;

  @Column({
    name: "STAD",
    length: 255,
  })
  stad: string;

  @Column({
    name: "LAND",
    length: 255,
  })
  land: string;

  @Column({
    name: "TELEFOONNUMMER",
    length: 255,
  })
  telefoonnummer: string;
}
