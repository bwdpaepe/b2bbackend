import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  // OneToOne,
  // JoinColumn,
  // DeleteDateColumn,
  // ManyToOne,
  // JoinTable,
  // ManyToMany,
} from "typeorm";


// TODO - relaties met andere entiteiten toevoegen 

@Entity({ name: "gebruikers" }) //  User entity will be mapped to the 'gebruikers' table in the MySQL database
export class User {
  @PrimaryGeneratedColumn({ name: "ID" })
  userId: number;

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
