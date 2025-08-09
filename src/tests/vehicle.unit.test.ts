// src/tests/vehicle.unit.test.ts

import { Vehicle } from "../entities/Vehicle";

describe("Vehicle Entity", () => {
  it("should create a new Vehicle instance with correct values", () => {
    const vehicle = new Vehicle();
    vehicle.type = "Cargo Plane";
    vehicle.model = "Boeing 747";
    vehicle.licensePlate = "ABC123";
    vehicle.capacity = 20000;

    expect(vehicle.type).toBe("Cargo Plane");
    expect(vehicle.model).toBe("Boeing 747");
    expect(vehicle.licensePlate).toBe("ABC123");
    expect(vehicle.capacity).toBe(20000);
  });
});