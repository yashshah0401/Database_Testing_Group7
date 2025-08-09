import { Repair } from "../entities/Repair";

describe("Repair Entity - Property Test", () => {
  it("should store and retrieve property values correctly", () => {
    const r = new Repair();
    r.id = 2;
    r.vehicleId = 20;
    r.mechanicId = 8;
    r.estimatedRepairTime = 4;    // integer
    r.actualRepairTime = null;    // nullable

    expect(r.id).toBe(2);
    expect(r.vehicleId).toBe(20);
    expect(r.mechanicId).toBe(8);
    expect(typeof r.estimatedRepairTime).toBe("number");
    expect(r.actualRepairTime).toBeNull();
  });
});
