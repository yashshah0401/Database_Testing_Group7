import { Entity, PrimaryColumn } from "typeorm";

@Entity("tripshipments")
export class TripShipment {
  @PrimaryColumn({ name: "trip_id", type: "int" })
  tripId!: number;

  @PrimaryColumn({ name: "shipment_id", type: "int" })
  shipmentId!: number;
}
