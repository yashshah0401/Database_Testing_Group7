import request from "supertest";
import { AppDataSource } from "../database/data-source";
import { app } from "../index";
import { Vehicle } from "../entities/Vehicle";
import { Employee } from "../entities/Employee";
import { Repair } from "../entities/Repair";

describe("Repair Routes - Integration Test", () => {
  let vehicleId: number;
  let mechanicId: number;
  let createdRepairId: number;

  beforeAll(async () => {
    await AppDataSource.initialize();

    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const v = vehicleRepo.create({
      type: "In-city Truck",
      model: "Test Model",
      licensePlate: "TEST123",
      capacity: 1500,
    });
    const savedV = await vehicleRepo.save(v);
    vehicleId = savedV.id;

    const employeeRepo = AppDataSource.getRepository(Employee);
    const e = employeeRepo.create({
      name: "John",
      surname: "Doe",
      seniority: 5,
      isMechanic: true,
    });
    const savedE = await employeeRepo.save(e);
    mechanicId = savedE.id;
  });

afterAll(async () => {
  // child first, then parents
  await AppDataSource.getRepository(Repair).createQueryBuilder().delete().execute();
  await AppDataSource.getRepository(Vehicle).createQueryBuilder().delete().execute();
  await AppDataSource.getRepository(Employee).createQueryBuilder().delete().execute();

  await AppDataSource.destroy();
});

  it("should create and retrieve a repair (times are integers)", async () => {
    const createRes = await request(app)
      .post("/repairs")
      .send({
        vehicleId,
        mechanicId,
        estimatedRepairTime: 5, // integers to match DB
        actualRepairTime: 6,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.vehicleId).toBe(vehicleId);
    expect(createRes.body.mechanicId).toBe(mechanicId);
    expect(createRes.body.estimatedRepairTime).toBe(5);
    expect(createRes.body.actualRepairTime).toBe(6);

    createdRepairId = createRes.body.id;

    const getRes = await request(app).get(`/repairs/${createdRepairId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(createdRepairId);
  });

  it("should update a repair", async () => {
    const putRes = await request(app)
      .put(`/repairs/${createdRepairId}`)
      .send({ estimatedRepairTime: 8, actualRepairTime: 9 });

    expect(putRes.status).toBe(200);
    expect(putRes.body.estimatedRepairTime).toBe(8);
    expect(putRes.body.actualRepairTime).toBe(9);
  });

  it("should delete a repair", async () => {
    const delRes = await request(app).delete(`/repairs/${createdRepairId}`);
    expect(delRes.status).toBe(204);

    const getRes = await request(app).get(`/repairs/${createdRepairId}`);
    expect(getRes.status).toBe(404);
  });
});