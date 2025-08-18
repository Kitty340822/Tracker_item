import { Pool } from 'pg';

export const pool = new Pool({
  user: 'spare_admin',
  host: 'localhost',
  database: 'spare_claim_db',
  password: 'p@sz123',
  port: 5432,
});