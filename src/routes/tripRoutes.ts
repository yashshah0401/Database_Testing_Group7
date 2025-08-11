import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Trip } from "../entities/Trip";

const router = Router();
const tripRepo = () => AppDataSource.getRepository(Trip);

// GET /trips
router.get("/", async (_req, res) => {
  const items = await tripRepo().find();
  res.json(items);
});

// GET /trips/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const item = await tripRepo().findOne({ where: { id } });
  if (!item) return res.status(404).json({ error: "Trip not found" });
  res.json(item);
});

// POST /trips
router.post("/", async (req, res) => {
  const { origin, destination } = req.body || {};
  if (!origin || !destination) {
    return res.status(400).json({ error: "origin and destination are required" });
  }
  const entity = tripRepo().create({ origin: String(origin), destination: String(destination) });
  const saved = await tripRepo().save(entity);
  res.status(201).json(saved);
});

// PUT /trips/:id
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { origin, destination } = req.body || {};
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  if (!origin || !destination) {
    return res.status(400).json({ error: "origin and destination are required" });
  }
  const existing = await tripRepo().findOne({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Trip not found" });
  existing.origin = String(origin);
  existing.destination = String(destination);
  const updated = await tripRepo().save(existing);
  res.json(updated);
});

// PATCH /trips/:id
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const existing = await tripRepo().findOne({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Trip not found" });

  const { origin, destination } = req.body || {};
  if (origin !== undefined) existing.origin = String(origin);
  if (destination !== undefined) existing.destination = String(destination);

  const updated = await tripRepo().save(existing);
  res.json(updated);
});

// DELETE /trips/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const result = await tripRepo().delete(id);
  if (result.affected === 0) return res.status(404).json({ error: "Trip not found" });
  res.status(204).send();
});

// ------- Shipment links for a trip (via tripshipments) -------

// GET /trips/:id/shipments  -> list shipments linked to a trip
router.get("/:id/shipments", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const rows = await AppDataSource.manager.query(
    `
    SELECT s.*
    FROM tripshipments ts
    JOIN shipments s ON s.shipment_id = ts.shipment_id
    WHERE ts.trip_id = $1
    ORDER BY s.shipment_id ASC
    `,
    [id]
  );
  res.json(rows);
});

// POST /trips/:id/shipments  -> attach a shipment
router.post("/:id/shipments", async (req, res) => {
  const id = Number(req.params.id);
  const { shipmentId } = req.body || {};
  if (Number.isNaN(id) || shipmentId == null) {
    return res.status(400).json({ error: "trip id and shipmentId are required" });
  }
  try {
    await AppDataSource.manager.query(
      `INSERT INTO tripshipments (trip_id, shipment_id) VALUES ($1, $2)`,
      [id, Number(shipmentId)]
    );
    res.status(201).json({ tripId: id, shipmentId: Number(shipmentId) });
  } catch (e: any) {
    // Primary key or FK violation -> 409
    return res.status(409).json({ error: "Link already exists or invalid trip/shipment id" });
  }
});

// DELETE /trips/:id/shipments/:shipmentId -> detach a shipment
router.delete("/:id/shipments/:shipmentId", async (req, res) => {
  const id = Number(req.params.id);
  const shipmentId = Number(req.params.shipmentId);
  if (Number.isNaN(id) || Number.isNaN(shipmentId)) {
    return res.status(400).json({ error: "Invalid ids" });
  }
  const result = await AppDataSource.manager.query(
    `DELETE FROM tripshipments WHERE trip_id = $1 AND shipment_id = $2`,
    [id, shipmentId]
  );
  // result is an array for SELECTs; for DELETE, TypeORM’s .query returns driver-specific;
  // just return 204 always since it’s idempotent.
  res.status(204).send();
});

export default router;
