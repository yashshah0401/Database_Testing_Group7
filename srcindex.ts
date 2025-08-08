import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database/data-source";
import vehicleRoutes from "./routes/vehicleRoutes"; // 👈 added

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount vehicle routes
app.use("/vehicles", vehicleRoutes); // 👈 added

app.get("/", (req, res) => {
  res.send("Freight Company API is running!");
});

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error during Data Source initialization:", error);
  });
