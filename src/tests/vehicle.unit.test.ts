import { Vehicle } from "../entities/Vehicle";

describe("Vehicle Entity Unit Tests", () => {
  test("should create a Vehicle instance with valid data", () => {
    const vehicle = new Vehicle();
    vehicle.type = "Cargo Plane";
    vehicle.model = "Boeing 747";
    vehicle.licensePlate = "AIR001";
    vehicle.capacity = 100000;

    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle.type).toBe("Cargo Plane");
    expect(vehicle.model).toBe("Boeing 747");
    expect(vehicle.licensePlate).toBe("AIR001");
    expect(vehicle.capacity).toBe(100000);
  });

  test("should allow capacity to be 0", () => {
    const vehicle = new Vehicle();
    vehicle.capacity = 0;

    expect(vehicle.capacity).toBe(0);
  });
});
