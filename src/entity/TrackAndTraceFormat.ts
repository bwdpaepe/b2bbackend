import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Transportdienst } from "./Transportdienst";

@Entity({name: "tracktraceformats"})
export class TrackAndTraceFormat {
  @PrimaryGeneratedColumn({name: "ID"})
  trackAndTraceFormatId: number;

  @OneToOne(() => Transportdienst, (transportdienst) => transportdienst.trackAndTraceFormat)
  transportdienst: Transportdienst;

  @Column({ name: "VERIFICATIECODESTRING", type: "varchar", length: 255})
  verificatiecodestring: string;

}