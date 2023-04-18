import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "session" })
export class Session {
  @PrimaryGeneratedColumn({ name: "sessionId" })
  sessionId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId"})
  user: User;

  @Column({ nullable: false})
  sessionStart: Date;

  @Column()
  sessionEnd: Date;
}