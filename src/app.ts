import express from "express";
import "reflect-metadata";

import vehicleRoutes from "./routes/vehicleRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import repairRoutes from "./routes/repairRoutes";

const app = express();

app.use(express.json());

// Routes
app.use("/vehicles", vehicleRoutes);
app.use("/employees", employeeRoutes);
app.use("/repairs", repairRoutes);

// Health check (optional)
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "Freight Company API" });
});

export default app;
