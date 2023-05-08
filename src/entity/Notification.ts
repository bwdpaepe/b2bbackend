import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bestelling } from "./Bestelling";
import { User } from "./User";

@Entity({ name: "NOTIFICATIE" })
export class Notification {
  @PrimaryGeneratedColumn({ name: "ID" })
  notificationId: number;

  @Column({ name: "CREATIONDATE", type: "datetime" })
  creationDate: Date;

  @Column({ name: "ISBEKENEN", type: "boolean" })
  isBekeken: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: "AANKOPER_ID" })
  aankoper: User;

  @OneToOne(() => Bestelling, (bestelling) => bestelling.notification)
  @JoinColumn({ name: "BESTELLING_ID" })
  bestelling: Bestelling;
}
