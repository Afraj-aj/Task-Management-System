import { Pool } from "pg";
import dotenv from "dotenv";
import PG from "pg";

dotenv.config();

const { types } = PG;
types.setTypeParser(1082, (val) => val); // return as string 'YYYY-MM-DD'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
