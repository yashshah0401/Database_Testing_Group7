import { TripShipment } from "../entities/TripShipment";

describe("TripShipment Entity - Unit Test", () => {
  it("should create a TripShipment link", () => {
    const ts = new TripShipment();
    ts.tripId = 1;
    ts.shipmentId = 2;
    expect(ts.tripId).toBe(1);
    expect(ts.shipmentId).toBe(2);
  });
});
