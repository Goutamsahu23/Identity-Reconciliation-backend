import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.RENDER_POSTGRES_HOST; 
const port = parseInt(process.env.RENDER_POSTGRES_PORT || '5432', 10); 
const username = process.env.RENDER_POSTGRES_USERNAME; 
const password = process.env.RENDER_POSTGRES_PASSWORD; 
const database = process.env.RENDER_POSTGRES_DATABASE;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  entities: ["src/entity/*.ts"],
  synchronize: true,
  logging: true,
});
