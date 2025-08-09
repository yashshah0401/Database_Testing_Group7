import "reflect-metadata";
import { DataSource } from "typeorm";
import { Vehicle } from "../entities/Vehicle";
import { Employee } from "../entities/Employee"; 
import dotenv from "dotenv";

dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);
const DB_USERNAME = process.env.DB_USERNAME || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "pass1234";
const DB_NAME = process.env.DB_NAME || "freight_company";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: true,
  entities: [Vehicle, Employee], 
  migrations: ["src/migrations/*.ts"],
});
