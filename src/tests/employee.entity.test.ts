// src/tests/employee.entity.test.ts

import { Employee } from "../entities/Employee";

describe("Employee Entity", () => {
  test("should create a new employee instance", () => {
    const employee = new Employee();
    employee.name = "Jane";
    employee.surname = "Smith";
    employee.seniority = 5;
    employee.isMechanic = true;

    expect(employee.name).toBe("Jane");
    expect(employee.surname).toBe("Smith");
    expect(employee.seniority).toBe(5);
    expect(employee.isMechanic).toBe(true);
  });
});