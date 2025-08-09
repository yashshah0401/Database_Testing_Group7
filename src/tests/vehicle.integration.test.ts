import request from "supertest";
import { AppDataSource } from "../database/data-source";
import app from "../app";

let server: any;

beforeAll(async () => {
  await AppDataSource.initialize();
  server = app.listen(0);
});

afterAll(async () => {
  await AppDataSource.destroy();
  if (server && server.close) {
    await new Promise<void>((resolve, reject) => {
      server.close((err?: Error) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
});

describe("/vehicles API Integration Tests", () => {
  let createdVehicleId: number;

  test("POST /vehicles creates a new vehicle", async () => {
    const res = await request(server).post("/vehicles").send({
      type: "Cargo Plane",
      model: "Boeing 747",
      licensePlate: "INT001",
      capacity: 50000,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdVehicleId = res.body.id;
  });

  test("GET /vehicles returns list of vehicles", async () => {
    const res = await request(server).get("/vehicles");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /vehicles/:id returns single vehicle", async () => {
    const response = await request(server).get(`/vehicles/${createdVehicleId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", createdVehicleId);
  });

  test("PUT /vehicles/:id updates the vehicle", async () => {
    const res = await request(server)
      .put(`/vehicles/${createdVehicleId}`)
      .send({ model: "Updated Boeing" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("model", "Updated Boeing");
  });

  test("DELETE /vehicles/:id deletes the vehicle", async () => {
    const res = await request(server).delete(`/vehicles/${createdVehicleId}`);
    expect(res.status).toBe(204);
  });

  test("GET /vehicles/:id 404 for deleted vehicle", async () => {
    const res = await request(server).get(`/vehicles/${createdVehicleId}`);
    expect(res.status).toBe(404);
  });
});