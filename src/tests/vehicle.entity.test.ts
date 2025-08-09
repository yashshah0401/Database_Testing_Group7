import { Vehicle } from "../entities/Vehicle";

describe("Vehicle Entity", () => {
  it("should create a new Vehicle instance with correct values", () => {
    const vehicle = new Vehicle();
    vehicle.type = "In-city Truck";
    vehicle.model = "Ford Transit";
    vehicle.licensePlate = "XYZ-9876";
    vehicle.capacity = 1200;

    expect(vehicle.type).toBe("In-city Truck");
    expect(vehicle.model).toBe("Ford Transit");
    expect(vehicle.licensePlate).toBe("XYZ-9876");
    expect(vehicle.capacity).toBe(1200);
  });
});
