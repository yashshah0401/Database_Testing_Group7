import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("trips")
export class Trip {
  @PrimaryGeneratedColumn({ name: "trip_id" })
  id!: number;

  @Column({ name: "origin", type: "varchar", length: 100 })
  origin!: string;

  @Column({ name: "destination", type: "varchar", length: 100 })
  destination!: string;
}
