import { Repair } from "../entities/Repair";

describe("Repair Entity - Unit Test", () => {
  it("should create a new Repair instance with correct values", () => {
    const r = new Repair();
    r.id = 1;
    r.vehicleId = 10;
    r.mechanicId = 5;
    r.estimatedRepairTime = 6; // integer
    r.actualRepairTime = 7;    // integer

    expect(r.id).toBe(1);
    expect(r.vehicleId).toBe(10);
    expect(r.mechanicId).toBe(5);
    expect(r.estimatedRepairTime).toBe(6);
    expect(r.actualRepairTime).toBe(7);
  });
});
