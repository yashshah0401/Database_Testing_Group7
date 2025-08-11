import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("shipments")
export class Shipment {
  @PrimaryGeneratedColumn({ name: "shipment_id" })
  id!: number;

  @Column({ name: "customer_id", type: "int" })
  customerId!: number;

  @Column({ name: "weight", type: "int" })
  weight!: number;

  // numeric(10,2) in Postgres — keep as string to avoid float precision issues
  @Column({ name: "value", type: "numeric", precision: 10, scale: 2 })
  value!: string;

  @Column({ name: "origin", type: "varchar", length: 100 })
  origin!: string;

  @Column({ name: "destination", type: "varchar", length: 100 })
  destination!: string;
}
