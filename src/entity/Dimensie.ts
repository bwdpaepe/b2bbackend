import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Bedrijf } from "./Bedrijf";

@Entity({ name: "dimensies" })
export class Dimensie {
  @PrimaryGeneratedColumn({ name: "ID" })
  dimensieId: number;

  @Column({
    name: "BREEDTE",
    type: "decimal",
  })
  breedte: number;

  @Column({
    name: "HOOGTE",
    type: "decimal",
  })
  hoogte: number;

  @Column({
    name: "LENGTE",
    type: "decimal",
  })
  lengte: number;

}
