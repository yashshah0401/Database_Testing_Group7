import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  type: string;

  @Column({ type: "varchar" })
  model: string;

  @Column({ type: "varchar" })
  licensePlate: string;

  @Column({ type: "int" })
  capacity: number;
}