import request from "supertest";
import { AppDataSource } from "../../src/database/data-source";
import app from "../../src/app";

let server: any;

beforeAll(async () => {
  await AppDataSource.initialize();
  server = app.listen(0);
});

afterAll(async () => {
  await AppDataSource.destroy();
  server.close();
});

describe("Employee Integration Tests", () => {
  let employeeId: number;

  it("should create a new employee", async () => {
    const res = await request(server).post("/employees").send({
      name: "Test",
      surname: "Employee",
      seniority: 2,
      isMechanic: false
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test");
    employeeId = res.body.id;
  });

  it("should fetch all employees", async () => {
    const res = await request(server).get("/employees");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch a specific employee", async () => {
    const res = await request(server).get(`/employees/${employeeId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(employeeId);
  });

  it("should update the employee", async () => {
    const res = await request(server)
      .put(`/employees/${employeeId}`)
      .send({ seniority: 10 });

    expect(res.status).toBe(200);
    expect(res.body.seniority).toBe(10);
  });

  it("should delete the employee", async () => {
    const res = await request(server).delete(`/employees/${employeeId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it("should return 404 for deleted employee", async () => {
    const res = await request(server).get(`/employees/${employeeId}`);
    expect(res.status).toBe(404);
  });
});
