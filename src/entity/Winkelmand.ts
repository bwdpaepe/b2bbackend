import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";
import { WinkelmandProducten } from "./WinkelmandProducten";
  
  @Entity({ name: "winkelmand" })
  export class Winkelmand {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;
  
    @OneToOne(() => User, {cascade: false, nullable: false})
    @JoinColumn({name: "user_id"})
    user: User;

    @OneToMany(() => WinkelmandProducten, (winkelmandProducten) => winkelmandProducten.winkelmand)
    @JoinColumn({name: "product_id"})
    @JoinTable({name: "winkelmand_producten"})
    winkelmandProducten: WinkelmandProducten[];  

    totaalBedrag: number; 

  }
  