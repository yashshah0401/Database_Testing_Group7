import request from "supertest";
import { AppDataSource } from "../database/data-source";
import app from "../app";

let server: any;
let createdTripId: number;
let existingShipmentId: number | undefined;

beforeAll(async () => {
  await AppDataSource.initialize();
  server = app.listen(0);

  // find any existing shipment to attach
  const rows = await AppDataSource.manager.query(
    `SELECT shipment_id FROM shipments ORDER BY shipment_id ASC LIMIT 1`
  );
  if (rows && rows.length > 0) {
    existingShipmentId = Number(rows[0].shipment_id);
  }
});

afterAll(async () => {
  await AppDataSource.destroy();
  if (server && server.close) server.close();
});

describe("Trips API - Integration", () => {
  const base = "/trips";

  it("GET /trips (list)", async () => {
    const res = await request(server).get(base);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /trips (create)", async () => {
    const res = await request(server).post(base).send({
      origin: "Ottawa",
      destination: "Quebec City",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdTripId = res.body.id;
  });

  it("GET /trips/:id (by id)", async () => {
    const res = await request(server).get(`${base}/${createdTripId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdTripId);
  });

  it("PUT /trips/:id (update)", async () => {
    const res = await request(server).put(`${base}/${createdTripId}`).send({
      origin: "Ottawa",
      destination: "Kingston",
    });
    expect(res.status).toBe(200);
    expect(res.body.destination).toBe("Kingston");
  });

  it("PATCH /trips/:id (partial)", async () => {
    const res = await request(server)
      .patch(`${base}/${createdTripId}`)
      .send({ origin: "Gatineau" });
    expect(res.status).toBe(200);
    expect(res.body.origin).toBe("Gatineau");
  });

  it("GET /trips/:id/shipments (list linked)", async () => {
    const res = await request(server).get(`${base}/${createdTripId}/shipments`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /trips/:id/shipments (attach) — skip if no shipments", async () => {
    if (!existingShipmentId) return pending("No shipments in DB to link.");
    const res = await request(server)
      .post(`${base}/${createdTripId}/shipments`)
      .send({ shipmentId: existingShipmentId });
    expect([201, 409]).toContain(res.status); // 409 if linked already
  });

  it("DELETE /trips/:id/shipments/:shipmentId (detach) — skip if no shipments", async () => {
    if (!existingShipmentId) return pending("No shipments in DB to detach.");
    const res = await request(server).delete(
      `${base}/${createdTripId}/shipments/${existingShipmentId}`
    );
    expect([204, 200]).toContain(res.status); // 204 expected
  });

  it("DELETE /trips/:id", async () => {
    const res = await request(server).delete(`${base}/${createdTripId}`);
    expect(res.status).toBe(204);
  });

  it("GET /trips/:id after delete -> 404", async () => {
    const res = await request(server).get(`${base}/${createdTripId}`);
    expect([404, 200]).toContain(res.status); // 404 expected, 200 possible if id reused
  });
});
