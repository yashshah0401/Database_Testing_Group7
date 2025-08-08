import request from "supertest";
import { AppDataSource } from "../database/data-source";
import app from "../app";
import { Vehicle } from "../entities/Vehicle";

describe("🚚 /vehicles API Integration Tests", () => {
  let createdVehicleId: number;

  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  test("POST /vehicles ➕ creates a new vehicle", async () => {
    const res = await request(app).post("/vehicles").send({
      type: "Cargo Plane",
      model: "Boeing 747",
      licensePlate: "INT001",
      capacity: 50000,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdVehicleId = res.body.id;

    const check = await request(app).get(`/vehicles/${createdVehicleId}`);
    expect(check.status).toBe(200);
    expect(check.body).toHaveProperty("id", createdVehicleId);
  });

  test("GET /vehicles 📦 returns list of vehicles", async () => {
    const res = await request(app).get("/vehicles");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /vehicles/:id 🔍 returns single vehicle", async () => {
    const response = await request(app).get(`/vehicles/${createdVehicleId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", createdVehicleId);
  });

  test("PUT /vehicles/:id ✏️ updates the vehicle", async () => {
    const res = await request(app)
      .put(`/vehicles/${createdVehicleId}`)
      .send({ model: "Updated Boeing" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("model", "Updated Boeing");
  });

  test("DELETE /vehicles/:id 🗑️ deletes the vehicle", async () => {
    const res = await request(app).delete(`/vehicles/${createdVehicleId}`);
    expect(res.status).toBe(204);
  });

  test("GET /vehicles/:id ❌ 404 for deleted vehicle", async () => {
    const res = await request(app).get(`/vehicles/${createdVehicleId}`);
    expect(res.status).toBe(404);
  });
});
