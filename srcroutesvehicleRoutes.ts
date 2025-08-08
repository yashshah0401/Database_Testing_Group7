import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Vehicle } from "../entities/Vehicle";

const router = Router();
const vehicleRepo = AppDataSource.getRepository(Vehicle);

// GET /vehicles - all
router.get("/", async (_req, res) => {
  try {
    const vehicles = await vehicleRepo.find();
    res.json(vehicles);
  } catch (err) {
    console.error("GET /vehicles error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /vehicles/:id - one
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const vehicle = await vehicleRepo.findOneBy({ id });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    res.json(vehicle);
  } catch (err) {
    console.error("GET /vehicles/:id error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /vehicles - create
router.post("/", async (req, res) => {
  try {
    const { type, model, licensePlate, capacity } = req.body;

    if (!type || !model || !licensePlate || capacity == null) {
      return res.status(400).json({ message: "type, model, licensePlate, capacity are required" });
    }
    if (typeof capacity !== "number" || capacity < 0) {
      return res.status(400).json({ message: "capacity must be a non-negative number" });
    }

    const newVehicle = vehicleRepo.create({ type, model, licensePlate, capacity });
    const savedVehicle = await vehicleRepo.save(newVehicle);
    res.status(201).json(savedVehicle);
  } catch (err) {
    console.error("POST /vehicles error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT /vehicles/:id - update
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const vehicle = await vehicleRepo.findOneBy({ id });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const { type, model, licensePlate, capacity } = req.body;

    if (capacity != null && (typeof capacity !== "number" || capacity < 0)) {
      return res.status(400).json({ message: "capacity must be a non-negative number" });
    }

    vehicleRepo.merge(vehicle, { type, model, licensePlate, capacity });
    const updated = await vehicleRepo.save(vehicle);
    res.json(updated);
  } catch (err) {
    console.error("PUT /vehicles/:id error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE /vehicles/:id - delete
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const result = await vehicleRepo.delete(id);
    if (result.affected === 0) return res.status(404).json({ message: "Vehicle not found" });

    res.status(204).send();
  } catch (err) {
    console.error("DELETE /vehicles/:id error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;