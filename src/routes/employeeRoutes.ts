import express from "express";
import { AppDataSource } from "../database/data-source";
import { Employee } from "../entities/Employee";

const router = express.Router();

// GET all employees
router.get("/", async (req, res) => {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employees = await employeeRepo.find();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employee = await employeeRepo.findOneBy({ id: Number(req.params.id) });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST create new employee
router.post("/", async (req, res) => {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const newEmployee = employeeRepo.create(req.body);
    const savedEmployee = await employeeRepo.save(newEmployee);
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update existing employee
router.put("/:id", async (req, res) => {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employee = await employeeRepo.findOneBy({ id: Number(req.params.id) });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employeeRepo.merge(employee, req.body);
    const updatedEmployee = await employeeRepo.save(employee);
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const result = await employeeRepo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
