import { Trip } from "../entities/Trip";

describe("Trip Entity - Unit Test", () => {
  it("should create a Trip with origin and destination", () => {
    const t = new Trip();
    t.id = 1;
    t.origin = "Toronto";
    t.destination = "Montreal";
    expect(t.id).toBe(1);
    expect(t.origin).toBe("Toronto");
    expect(t.destination).toBe("Montreal");
  });
});
