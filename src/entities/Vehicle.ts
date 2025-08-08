import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;

  @Column()
  model!: string;

  @Column()
  licensePlate!: string;

  @Column()
  capacity!: number;
}