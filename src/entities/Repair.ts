import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("repair")
export class Repair {
  @PrimaryGeneratedColumn()
  id!: number;

  // Explicit int types (DB shows INTEGER)
  @Column("int")
  estimatedRepairTime!: number;

  @Column("int", { nullable: true })
  actualRepairTime!: number | null;

  @Column("int")
  vehicleId!: number;

  @Column("int")
  mechanicId!: number;
}