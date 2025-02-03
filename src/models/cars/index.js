import { query } from "../../core/database/postgres-service.js";
import format from "pg-format";
const SCHEMA = "public";
const NAME = "car_ads";

export async function getCarsSold() {
  let sqlQuery;

  sqlQuery = `SELECT cars_sold FROM ${SCHEMA}.admins WHERE admin_id = 1`;

  sqlVariables = [];
  return (await query(sqlQuery, sqlVariables)).rows;
}

export async function getCarsByAdminId(adminId) {
  let sqlQuery, sqlVariables;

  sqlQuery = `SELECT * FROM ${SCHEMA}.${NAME} WHERE admin_id = $1`;
  sqlVariables = [adminId];
  return (await query(sqlQuery, sqlVariables)).rows;
}

export async function getAllCars() {
  let sqlQuery, sqlVariables;

  sqlQuery = `select car_id , publish_date ,image_urls , images_sorted , brand , model , trim , mileage , year_manufactured , body_condition , short_description , type , payment_type from ${NAME}
      WHERE active = true
    `;
  sqlVariables = [];
  return (await query(sqlQuery, sqlVariables)).rows;
}

export async function getAllCarsDashboard() {
  let sqlQuery, sqlVariables;

  sqlQuery = `select * from ${NAME}
    `;
  sqlVariables = [];
  return (await query(sqlQuery, sqlVariables)).rows;
}

export async function getSlider() {
  let sqlQuery, sqlVariables;

  sqlQuery = ` SELECT car_id, publish_date, image_urls, images_sorted, brand, model, trim, mileage, payment_type, active
               FROM ${NAME}
               WHERE active = true
               ORDER BY publish_date DESC
               LIMIT 8; `;

  sqlVariables = [];
  return (await query(sqlQuery, sqlVariables)).rows;
}

export async function getCarById(car_id) {
  let sqlQuery, sqlVariables;

  sqlQuery = `SELECT * FROM ${NAME} WHERE car_id = $1;`;
  sqlVariables = [car_id];

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
    WHERE car_id = $1 ;`;

  const sqlVariables = [id];
  return query(sqlQuery, sqlVariables);
}

export async function updateCarById(id, column, value) {
  const sqlQuery = format(
    `UPDATE %I.%I SET %I = $1 WHERE car_id = $2 ;`,
    SCHEMA,
    NAME,
    column
  );
  const sqlVariables = [value, id];

  return query(sqlQuery, sqlVariables);
}
