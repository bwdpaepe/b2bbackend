import {
  Column,
  Entity,
  JoinColumn, ManyToOne, PrimaryColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { Product } from "./Product";
import { Winkelmand } from "./Winkelmand";

@Entity({name: "winkelmand_producten"})
export class WinkelmandProducten{
    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @PrimaryColumn({type: "int"})
    product_id: number
    @PrimaryColumn({type : "int"})
    winkelmand_id : number

    @ManyToOne(() => Winkelmand)
    @JoinColumn({name: "winkelmand_id"})
    winkelmand : Winkelmand;
    @ManyToOne(() => Product)
    @JoinColumn({name : "product_id"})
    product: Product;

    @Column({name: "aantal"})
    aantal: number;
}