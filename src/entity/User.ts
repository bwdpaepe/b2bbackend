import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Bedrijf } from "./Bedrijf";
import { Notification } from "./Notification";
import { Bestelling } from './Bestelling';

// TODO - relaties met andere entiteiten toevoegen
// OPLETTEN: table names zijn hoofdlettergevoelig in MySQL !!! Goed kijken naar exacte naam van de tabel in de remote DB (vichogent server)
@Entity({ name: "Gebruikers" }) //  User entity will be mapped to the 'Gebruikers' table in the MySQL database
export class User {
  @PrimaryGeneratedColumn({ name: "ID" })
  userId: number;

  @ManyToOne(() => Bedrijf, (bedrijf) => bedrijf.users /** , { eager: true } */) // Nu om te testen eager, later lazy van maken !!!
  @JoinColumn({ name: "bedrijf_id" })
  bedrijf: Bedrijf;

  @OneToMany(() => Notification, (notification) => notification.aankoper)
  notifications: Notification[];

  @OneToMany(() => Bestelling, (notification) => notification.aankoper)
  bestellingenAlsAankoper: Bestelling[];

  @Column({
    name: "Email_adres",
    length: 255,
    unique: true,
  })
  email: string;

  @Column({ name: "personeelsNr" })
  personeelsNr: string;

  @Column({
    name: "Hashed_paswoord",
    length: 255,
    select: false, // Deze kolom hiden, zodat niet automatisch gereturned bij ophalen van user uit DB
  })
  passwordHashed: string;

  @Column({ name: "Voornaam" })
  firstname: string;

  @Column({ name: "Familienaam" })
  lastname: string;

  @Column({ name: "Functie" })
  function: string;

  @Column({ name: "isActief" })
  isActive: boolean;

  @Column({ name: "soort" })
  soort: string;

  @Column({ name: "adres" })
  address: string;

  @Column({ name: "telefoonnummer" })
  phone: string;
}
