import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Shipment } from "../entities/Shipment";

const router = Router();
const repo = () => AppDataSource.getRepository(Shipment);

// GET /shipments
router.get("/", async (_req, res) => {
  const items = await repo().find();
  res.json(items);
});

// GET /shipments/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const item = await repo().findOne({ where: { id } });
  if (!item) return res.status(404).json({ error: "Shipment not found" });

  res.json(item);
});

// POST /shipments
router.post("/", async (req, res) => {
  try {
    const { customerId, weight, value, origin, destination } = req.body;

    if (
      customerId == null ||
      weight == null ||
      value == null ||
      !origin ||
      !destination
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure correct types. Keep value as string for numeric(10,2)
    const entity = repo().create({
      customerId: Number(customerId),
      weight: Number(weight),
      value: String(value),
      origin: String(origin),
      destination: String(destination),
    });

    const saved = await repo().save(entity);
    res.status(201).json(saved);
  } catch (e: any) {
    console.error("Error creating shipment:", e?.message || e);
    // FK to customers may fail if customer_id doesn't exist
    res.status(500).json({ error: "Failed to create shipment" });
  }
});

// PUT /shipments/:id  (full update)
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const existing = await repo().findOne({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Shipment not found" });

  const { customerId, weight, value, origin, destination } = req.body;
  if (
    customerId == null ||
    weight == null ||
    value == null ||
    !origin ||
    !destination
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  existing.customerId = Number(customerId);
  existing.weight = Number(weight);
  existing.value = String(value);
  existing.origin = String(origin);
  existing.destination = String(destination);

  try {
    const updated = await repo().save(existing);
    res.json(updated);
  } catch (e: any) {
    console.error("Error updating shipment:", e?.message || e);
    res.status(500).json({ error: "Failed to update shipment" });
  }
});

// PATCH /shipments/:id  (partial update)
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const existing = await repo().findOne({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Shipment not found" });

  const { customerId, weight, value, origin, destination } = req.body;

  if (customerId !== undefined) existing.customerId = Number(customerId);
  if (weight !== undefined) existing.weight = Number(weight);
  if (value !== undefined) existing.value = String(value);
  if (origin !== undefined) existing.origin = String(origin);
  if (destination !== undefined) existing.destination = String(destination);

  try {
    const updated = await repo().save(existing);
    res.json(updated);
  } catch (e: any) {
    console.error("Error patching shipment:", e?.message || e);
    res.status(500).json({ error: "Failed to patch shipment" });
  }
});

// DELETE /shipments/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const result = await repo().delete(id);
  if (result.affected === 0) return res.status(404).json({ error: "Shipment not found" });

  res.status(204).send();
});

export default router;
