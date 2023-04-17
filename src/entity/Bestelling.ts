import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BestellingStatus } from "../enums/BestellingStatusEnum";
import { Bedrijf } from "./Bedrijf";
import { Notification } from "./Notification";
import { User } from './User';

@Entity({ name: "bestelling" })
export class Bestelling {
  @PrimaryGeneratedColumn({ name: "ID" })
  bestellingId: number;

  @ManyToOne(() => Bedrijf, (bedrijf) => bedrijf.bestellingenAlsLeverancier)
  leverancierBedrijf: Bedrijf;

  @ManyToOne(() => Bedrijf, (bedrijf) => bedrijf.bestellingenAlsKlant)
  klantBedrijf: Bedrijf;

  @ManyToOne(() => User, (user) => user.bestellingenAlsAankoper)
  @JoinColumn({ name: "MEDEWERKER" })
  aankoper: User;

  @OneToOne(() => Notification, (notification) => notification.bestelling)
  notification: Notification;

  @Column({ name: "STATUS", type: "enum", enum: BestellingStatus })
  status: BestellingStatus;

  @Column({ name: "DATUMGEPLAATST", type: "date" })
  datumGeplaatst: Date;

  @Column({ name: "ORDERID", type: "varchar", length: 255 })
  orderId: string;

  @Column({ name: "TRACKANDTRACECODE", type: "varchar", length: 255 })
  trackAndTraceCode: string;
}
