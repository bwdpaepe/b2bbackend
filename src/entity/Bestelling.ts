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
import { Doos } from "./Doos";
import { Notification } from "./Notification";
import { Transportdienst } from "./Transportdienst";
import { User } from "./User";

@Entity({ name: "bestelling" })
export class Bestelling {
  @PrimaryGeneratedColumn({ name: "ID" })
  bestellingId: number;

  @ManyToOne(() => Bedrijf, (bedrijf) => bedrijf.bestellingenAlsLeverancier)
  @JoinColumn({ name: "Leverancier" })
  leverancierBedrijf: Bedrijf;

  @ManyToOne(() => Bedrijf, (bedrijf) => bedrijf.bestellingenAlsKlant)
  @JoinColumn({ name: "Klant" })
  klantBedrijf: Bedrijf;

  @ManyToOne(() => User, (user) => user.bestellingenAlsAankoper)
  @JoinColumn({ name: "Medewerker" })
  aankoper: User;

  @ManyToOne(
    () => Transportdienst,
    (transportdienst) => transportdienst.bestellingen
  )
  @JoinColumn({ name: "Transportdienst" })
  transportdienst: Transportdienst;

  //Many to one to Doos
  @ManyToOne(() => Doos)
  @JoinColumn({ name: "Doos" })
  doos: Doos;

  @OneToOne(() => Notification, (notification) => notification.bestelling)
  notification: Notification;

  @Column({ name: "STATUS", type: "enum", enum: BestellingStatus })
  status: BestellingStatus;

  @Column({ name: "DATUMGEPLAATST", type: "date" })
  datumGeplaatst: Date;

  @Column({ name: "LEVERADRESSTRAAT", type: "varchar", length: 255 })
  leveradresStraat: string;

  @Column({ name: "LEVERADRESNUMMER", type: "varchar", length: 255 })
  leveradresNummer: string;

  @Column({ name: "LEVERADRESPOSTCODE", type: "varchar", length: 255 })
  leveradresPostcode: string;

  @Column({ name: "LEVERADRESSTAD", type: "varchar", length: 255 })
  leveradresStad: string;

  @Column({ name: "LEVERADRESLAND", type: "varchar", length: 255 })
  leveradresLand: string;

  @Column({ name: "ORDERID", type: "varchar", length: 255 })
  orderId: string;

  @Column({ name: "TRACKANDTRACECODE", type: "varchar", length: 255 })
  trackAndTraceCode: string;

  @Column({ name: "KLANTNAAM", type: "date" })
  klantnaam: string;

  getStatusDescription(): string {
    return BestellingStatus[this.status];
  }
}
