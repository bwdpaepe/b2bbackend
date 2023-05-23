import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Bestelling } from "./Bestelling";
import { TrackAndTraceFormat } from "./TrackAndTraceFormat";

@Entity({ name: "Diensten"})
export class Transportdienst {
  @PrimaryGeneratedColumn({ name: "ID"})
  transportdienstId: number;

  @OneToMany(() => Bestelling, (bestelling) => bestelling.transportdienst)
  bestellingen: Bestelling[];

  @OneToOne(() => TrackAndTraceFormat, (trackAndTraceFormat) => trackAndTraceFormat.transportdienst)
  @JoinColumn({ name: "TRACKTRACEFORMAT_ID"})
  trackAndTraceFormat: TrackAndTraceFormat;

  @Column({ name: "naam", type: "varchar", length: 255})
  naam: string;

}