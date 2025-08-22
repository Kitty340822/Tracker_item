import { Pool } from 'pg';
import {drizzle} from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://spare_admin:p@sz123@localhost:5432/spare_claim_db',
  // user: 'spare_admin',
  // host: 'localhost',
  // database: 'spare_claim_db',
  // password: 'p@sz123',
  // port: 5432,
});
export const db = drizzle(pool);