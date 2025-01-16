import pg from "pg";
import { PG_SECRETS } from "../secrets/index.js";

const pool = new pg.Pool(PG_SECRETS);

export async function query(query, variables) {
  const client = await pool.connect();
  try {
    const res = await client.query(query, variables);
    return { data: res.rows, error: null }; // Return data and no error
  } catch (error) {
    console.error("Database query error:", error);
    return { data: null, error: error.message }; // Return no data and an error message
  } finally {
    client.release(); // Always release the client back to the pool
  }
}
