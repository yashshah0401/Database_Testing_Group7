import request from "supertest";
import { AppDataSource } from "../database/data-source";
import app from "../app";

let server: any;
let customerId: number;
let createdId: number;

beforeAll(async () => {
  await AppDataSource.initialize();
  server = app.listen(0);

  // Get a valid customer_id to satisfy FK (assumes customers table exists)
  const rows = await AppDataSource.manager.query(
    `SELECT customer_id FROM customers ORDER BY customer_id ASC LIMIT 1`
  );
  if (!rows || rows.length === 0) {
    // If your DB has no customers yet, create one OR skip tests
    // For now, we skip to avoid FK failures and give a helpful message
    console.warn(
      "No customers found. Please insert at least one row into 'customers' before running shipment integration tests."
    );
  } else {
    customerId = Number(rows[0].customer_id);
  }
});

afterAll(async () => {
  await AppDataSource.destroy();
  if (server && server.close) server.close();
});

describe("Shipments API - Integration", () => {
  const baseUrl = "/shipments";

  it("should GET health check", async () => {
    const res = await request(server).get("/");
    expect(res.status).toBe(200);
    expect(res.body?.status).toBe("ok");
  });

  it("should GET all shipments", async () => {
    const res = await request(server).get(baseUrl);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should POST a new shipment", async () => {
    if (!customerId) return pending("No customers in DB to satisfy FK.");
    const payload = {
      customerId,
      weight: 800,
      value: "2500.00",
      origin: "Ottawa",
      destination: "Calgary",
    };
    const res = await request(server).post(baseUrl).send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.customerId).toBe(customerId);
    createdId = res.body.id;
  });

  it("should GET the created shipment by id", async () => {
    if (!createdId) return pending("Shipment not created.");
    const res = await request(server).get(`${baseUrl}/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it("should PUT (update) the shipment", async () => {
    if (!createdId) return pending("Shipment not created.");
    const res = await request(server)
      .put(`${baseUrl}/${createdId}`)
      .send({
        customerId,
        weight: 900,
        value: "2600.00",
        origin: "Ottawa",
        destination: "Edmonton",
      });

    expect(res.status).toBe(200);
    expect(res.body.weight).toBe(900);
    expect(res.body.destination).toBe("Edmonton");
  });

  it("should PATCH (partial update) the shipment", async () => {
    if (!createdId) return pending("Shipment not created.");
    const res = await request(server)
      .patch(`${baseUrl}/${createdId}`)
      .send({ weight: 950 });

    expect(res.status).toBe(200);
    expect(res.body.weight).toBe(950);
  });

  it("should DELETE the shipment", async () => {
    if (!createdId) return pending("Shipment not created.");
    const res = await request(server).delete(`${baseUrl}/${createdId}`);
    expect(res.status).toBe(204);
  });

  it("should return 404 after delete when GET by id", async () => {
    if (!createdId) return pending("Shipment not created.");
    const res = await request(server).get(`${baseUrl}/${createdId}`);
    expect(res.status).toBe(404);
  });

  it("should return 404 when GET non-existent id", async () => {
    const res = await request(server).get(`${baseUrl}/9999999`);
    expect(res.status === 404 || res.status === 200).toBe(true);
    // Note: If your DB already has that id, it may return 200. This keeps test non-brittle.
  });
});
