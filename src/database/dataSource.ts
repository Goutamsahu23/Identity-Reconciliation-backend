import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.POSTGRES_HOST; 
const port = parseInt(process.env.RENDER_POSTGRES_PORT || '5432', 10); 
const username = process.env.POSTGRES_USER; 
const password = process.env.POSTGRES_PASSWORD; 
const database = process.env.POSTGRES_DATABASE;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['src/entity/*.ts'],
  synchronize: true,
  logging: true,
});