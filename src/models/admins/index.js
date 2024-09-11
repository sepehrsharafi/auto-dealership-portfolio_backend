import { query } from "../../core/database/postgres-service.js";
import format from "pg-format";
const SCHEMA = "public";
const NAME = "admins";

export async function getAdminById(id) {
  let sqlQuery, sqlVariables;

  sqlQuery = `SELECT * FROM ${SCHEMA}.${NAME}
      WHERE admin_id = $1`;
  sqlVariables = [id];

  return (await query(sqlQuery, sqlVariables)).rows;
}

export async function createAdmin(userName, password, role) {
  const sqlQuery = `INSERT INTO ${SCHEMA}.${NAME} (username , password , role )
    VALUES
      ( $1 , $2 , $3);`;

  const sqlVariables = [userName, password, role];
  return query(sqlQuery, sqlVariables);
}
export async function updateAdminDataById(id, column, value) {
  const sqlQuery = format(
    `UPDATE %I.%I SET %I = $1 WHERE admin_id = $2;`,
    SCHEMA,
    NAME,
    column
  );

  const sqlVariables = [value, id];

  return query(sqlQuery, sqlVariables);
}
export async function getAdminByUserName(userName) {
  const sqlQuery = `select * from ${SCHEMA}.${NAME}
  where username = $1`;

  const sqlVariables = [userName];
  return (await query(sqlQuery, sqlVariables)).rows[0];
}
