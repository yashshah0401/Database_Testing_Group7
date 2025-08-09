import express from "express";
import "reflect-metadata";
import vehicleRoutes from "./routes/vehicleRoutes";
import employeeRoutes from "./routes/employeeRoutes";

const app = express();

app.use(express.json());
app.use("/vehicles", vehicleRoutes);
app.use("/employees", employeeRoutes);

export default app;
