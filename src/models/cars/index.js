import { query } from "../../core/database/postgres-service.js";
import format from "pg-format";
const SCHEMA = "public";
const NAME = "cars";

export async function getCarsByAdminId(adminId) {
  let sqlQuery, sqlVariables;

  sqlQuery = `SELECT * FROM ${SCHEMA}.${NAME} WHERE admin _id = $1`;
  sqlVariables = [adminId];
  return (await query(sqlQuery, sqlVariables)).rows;
}
export async function getAllCars() {
  let sqlQuery, sqlVariables;

  sqlQuery = `SELECT * FROM ${SCHEMA}.${NAME} `;
  sqlVariables = [];
  return (await query(sqlQuery, sqlVariables)).rows;
}

export async function getCarById(id) {
  let sqlQuery, sqlVariables;

  sqlQuery = `SELECT * FROM ${SCHEMA}.${NAME}
      WHERE id = $1 `;
  sqlVariables = [id];

  return (await query(sqlQuery, sqlVariables)).rows;
}

export async function createCar(carDataObj) {
  const keys = Object.keys(carDataObj);
  const values = Object.values(carDataObj);

  const sqlQuery = `INSERT INTO ${SCHEMA}.${NAME} (${keys.join(", ")})
    VALUES
      (${keys.map((_, i) => `$${i + 1}`).join(", ")});`;

  return query(sqlQuery, values);
}

export async function deleteCarById(id) {
  const sqlQuery = `DELETE FROM ${SCHEMA}.${NAME}
    WHERE id = $1 ;`;

  const sqlVariables = [id];
  return query(sqlQuery, sqlVariables);
}

export async function updateCarById(id, column, value) {
  const sqlQuery = format(
    `UPDATE %I.%I SET %I = $1 WHERE id = $2 ;`,
    SCHEMA,
    NAME,
    column
  );
  const sqlVariables = [value, id];

  return query(sqlQuery, sqlVariables);
}
