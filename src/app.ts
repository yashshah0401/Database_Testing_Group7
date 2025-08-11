import express from "express";
import "reflect-metadata";

import vehicleRoutes from "./routes/vehicleRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import repairRoutes from "./routes/repairRoutes";
import shipmentRoutes from "./routes/shipmentRoutes";
import tripRoutes from "./routes/tripRoutes";

const app = express();

app.use(express.json());

// Routes
app.use("/vehicles", vehicleRoutes);
app.use("/employees", employeeRoutes);
app.use("/repairs", repairRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/trips", tripRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "Freight Company API" });
});

export default app;