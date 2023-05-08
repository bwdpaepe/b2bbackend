import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";

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
