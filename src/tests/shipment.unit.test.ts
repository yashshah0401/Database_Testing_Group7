import { Shipment } from "../entities/Shipment";

describe("Shipment Entity - Unit Test", () => {
  it("should create a Shipment instance with correct values", () => {
    const s = new Shipment();
    s.id = 1;
    s.customerId = 101;
    s.weight = 500;
    s.value = "1200.50"; // keep numeric(10,2) as string in TS
    s.origin = "Toronto";
    s.destination = "Vancouver";

    expect(s.id).toBe(1);
    expect(s.customerId).toBe(101);
    expect(s.weight).toBe(500);
    expect(s.value).toBe("1200.50");
    expect(s.origin).toBe("Toronto");
    expect(s.destination).toBe("Vancouver");
  });
});