import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Bedrijf } from "./Bedrijf";
import { Dimensie } from "./Dimensie";
import { Bestelling } from "./Bestelling";

@Entity({ name: "dozen" })
export class Doos {
  @PrimaryGeneratedColumn({ name: "ID" })
  doosId: number;

  @ManyToOne(() => Bedrijf)
  @JoinColumn({ name: "BEDRIJF_ID" })
  bedrijf: Bedrijf;

  @OneToOne(() => Dimensie, { eager: true , cascade: true}) // always eager load the Dimensie
  @JoinColumn({ name: "dimensie" })
  dimensie: Dimensie;

  @OneToMany(() => Bestelling, (bestelling) => bestelling.doos)
  bestellingen: Bestelling[];

  @Column({
    name: "DOOSTYPE",
    length: 255,
    unique: true,
  })
  type: string;

  @Column({
    name: "ISACTIEF",
    type: "boolean",
  })
  isActief: boolean;

  @Column({
    name: "NAAM",
    length: 255,
  })
  naam: string;

  @Column({
    name: "PRIJS",
    type: "decimal",
  })
  prijs: number;
}
