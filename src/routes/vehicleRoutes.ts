import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Vehicle } from "../entities/Vehicle";

const router = Router();
const vehicleRepo = AppDataSource.getRepository(Vehicle);

// GET all vehicles
router.get("/", async (req, res) => {
  const vehicles = await vehicleRepo.find();
  res.json(vehicles);
});

// GET a single vehicle by ID ✅ [NEWLY ADDED]
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const vehicle = await vehicleRepo.findOneBy({ id });

  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  res.json(vehicle);
});

// POST new vehicle
router.post("/", async (req, res) => {
  const { type, model, licensePlate, capacity } = req.body;

  const newVehicle = vehicleRepo.create({ type, model, licensePlate, capacity });
  const savedVehicle = await vehicleRepo.save(newVehicle);

  res.status(201).json(savedVehicle);
});

// PUT update vehicle
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const vehicle = await vehicleRepo.findOneBy({ id });

  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  vehicleRepo.merge(vehicle, req.body);
  const updatedVehicle = await vehicleRepo.save(vehicle);

  res.json(updatedVehicle);
});

// DELETE a vehicle
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await vehicleRepo.delete(id);

  if (result.affected === 0) return res.status(404).json({ message: "Vehicle not found" });

  res.status(204).send();
});

export default router;
