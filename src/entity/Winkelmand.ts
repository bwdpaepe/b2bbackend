import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { WinkelmandProducten } from "./WinkelmandProducten";

@Entity({ name: "winkelmand" })
export class Winkelmand {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @OneToOne(() => User, { cascade: false, nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(
    () => WinkelmandProducten,
    (winkelmandProducten) => winkelmandProducten.winkelmand
  )
  @JoinColumn({ name: "winkelmand_producten_id" })
  winkelmandProducten: WinkelmandProducten[];

  totalPrice: any[]; // array of { bedrijfId: number, value: number }, see src\service\winkelmand.ts

  levertermijn: number; // max levertermijn of all products in winkelmand
}
