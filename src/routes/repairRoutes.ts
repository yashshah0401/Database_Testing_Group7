import express from "express";
import { AppDataSource } from "../database/data-source";
import { Repair } from "../entities/Repair";
import { Vehicle } from "../entities/Vehicle";
import { Employee } from "../entities/Employee";

const router = express.Router();

// GET all repairs
router.get("/", async (_req, res) => {
  try {
    const repairs = await AppDataSource.getRepository(Repair).find();
    res.json(repairs);
  } catch (e) {
    console.error("Error fetching repairs:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET by id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const repair = await AppDataSource.getRepository(Repair).findOneBy({ id });
    if (!repair) return res.status(404).json({ error: "Repair not found" });
    res.json(repair);
  } catch (e) {
    console.error("Error fetching repair:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE (expects integers for times)
router.post("/", async (req, res) => {
  try {
    const { vehicleId, mechanicId, estimatedRepairTime, actualRepairTime } = req.body;

    // Validate foreign keys using entity property names: Vehicle.id, Employee.id
    const vehicle = await AppDataSource.getRepository(Vehicle).findOneBy({ id: vehicleId });
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    const mechanic = await AppDataSource.getRepository(Employee).findOneBy({ id: mechanicId });
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });

    // Times must be numbers (DB columns are INTEGER)
    const repairData: Partial<Repair> = {
      vehicleId,
      mechanicId,
    };

    if (estimatedRepairTime !== undefined) {
      repairData.estimatedRepairTime = Number(estimatedRepairTime);
    }
    if (actualRepairTime !== undefined && actualRepairTime !== null) {
      repairData.actualRepairTime = Number(actualRepairTime);
    } else {
      repairData.actualRepairTime = null;
    }

    const repo = AppDataSource.getRepository(Repair);
    const repair = repo.create(repairData);
    const saved = await repo.save(repair);

    res.status(201).json(saved);
  } catch (e) {
    console.error("Error creating repair:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE (all optional; integers for times)
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(Repair);
    const repair = await repo.findOneBy({ id });
    if (!repair) return res.status(404).json({ error: "Repair not found" });

    const { vehicleId, mechanicId, estimatedRepairTime, actualRepairTime } = req.body;

    if (vehicleId !== undefined) {
      const vehicle = await AppDataSource.getRepository(Vehicle).findOneBy({ id: vehicleId });
      if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
      repair.vehicleId = vehicleId;
    }

    if (mechanicId !== undefined) {
      const mechanic = await AppDataSource.getRepository(Employee).findOneBy({ id: mechanicId });
      if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });
      repair.mechanicId = mechanicId;
    }

    if (estimatedRepairTime !== undefined) {
      repair.estimatedRepairTime = Number(estimatedRepairTime);
    }

    if (actualRepairTime !== undefined) {
      repair.actualRepairTime = actualRepairTime === null ? null : Number(actualRepairTime);
    }

    const updated = await repo.save(repair);
    res.json(updated);
  } catch (e) {
    console.error("Error updating repair:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(Repair);
    const repair = await repo.findOneBy({ id });
    if (!repair) return res.status(404).json({ error: "Repair not found" });

    await repo.remove(repair);
    res.status(204).send();
  } catch (e) {
    console.error("Error deleting repair:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
