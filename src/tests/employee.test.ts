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

describe("Employee API", () => {
  let employeeId: number;

  test("POST /employees - create employee", async () => {
    const res = await request(server).post("/employees").send({
      name: "John",
      surname: "Doe",
      seniority: 3,
      isMechanic: true,
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("John");
    employeeId = res.body.id;
  });

  test("GET /employees - get all employees", async () => {
    const res = await request(server).get("/employees");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /employees/:id - get single employee", async () => {
    const res = await request(server).get(`/employees/${employeeId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(employeeId);
  });

  test("PUT /employees/:id - update employee", async () => {
    const res = await request(server)
      .put(`/employees/${employeeId}`)
      .send({ seniority: 5 });

    expect(res.status).toBe(200);
    expect(res.body.seniority).toBe(5);
  });

  test("DELETE /employees/:id - delete employee", async () => {
    const res = await request(server).delete(`/employees/${employeeId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test("GET /employees/:id after delete - should return 404", async () => {
    const res = await request(server).get(`/employees/${employeeId}`);
    expect(res.status).toBe(404);
  });
});