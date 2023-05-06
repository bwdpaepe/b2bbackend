import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Bestelling } from "./Bestelling";
import { Product } from "./Product";

@Entity({ name: "besteldeproducten" })
export class BesteldProduct {
  @PrimaryGeneratedColumn({ name: "ID" })
  id: number;

  @Column({ name: "AANTAL", type: "int" })
  aantal: number;

  @Column({ name: "EENHEIDSPRIJS", type: "double" })
  eenheidsprijs: number;

  @Column({ name: "NAAM", length: 255 })
  naam: string;

  @ManyToOne(() => Bestelling, (bestelling) => bestelling.besteldeProducten)
  @JoinColumn({ name: "BESTELLING_ID" })
  bestelling: Bestelling;

  @ManyToOne(() => Product, (product) => product.besteldeProducten)
  @JoinColumn({ name: "PRODUCT_ID" })
  product: Product;
}
