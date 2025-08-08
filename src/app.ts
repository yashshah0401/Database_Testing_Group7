// src/app.ts
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./database/data-source";
import vehicleRoutes from "./routes/vehicleRoutes";

const app = express();

app.use(express.json());
app.use("/vehicles", vehicleRoutes);

export default app;
