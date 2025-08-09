import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn({ name: "employee_id" })
  id!: number;

  @Column({ name: "first_name", type: "varchar", length: 100 })
  name!: string;

  @Column({ name: "last_name", type: "varchar", length: 100 })
  surname!: string;

  @Column()
  seniority!: number;

  @Column({ name: "is_mechanic" })
  isMechanic!: boolean;
}