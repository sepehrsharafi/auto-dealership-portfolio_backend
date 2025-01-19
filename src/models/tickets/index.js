import { query } from "../../core/database/postgres-service.js";
import format from "pg-format";
const SCHEMA = "public";
const NAME = "tickets";

export async function getAllTickets() {
  let sqlQuery, sqlVariables;

  sqlQuery = `SELECT * From ${NAME}`;

  sqlVariables = [];

  return (await query(sqlQuery, sqlVariables)).rows;
}

export async function deleteTicketById(id) {
  let sqlQuery, sqlVariables;

  sqlQuery = `DELETE FROM ${SCHEMA}.${NAME} WHERE ticket_id = $1 ;`;

  sqlVariables = [id];

  return await query(sqlQuery, sqlVariables);
}

export async function updateTicketById(id) {
  let sqlQuery, sqlVariables;

  sqlQuery = `UPDATE ${NAME} SET is_processed = 'true' WHERE ticket_id = $1 ;`;

  sqlVariables = [id];

  return await query(sqlQuery, sqlVariables);
}

export async function postTicket(postParams) {
  let sqlQuery, sqlVariables;

  sqlQuery = `INSERT INTO tickets (first_name, last_name, phone_number, ticket_subject, ticket_body)
              VALUES ($1, $2, $3, $4, $5) RETURNING *;`;

  sqlVariables = [
    postParams.name.split(" ")[0],
    postParams.name.split(" ").length > 1 ? postParams.name.split(" ")[1] : "",
    postParams.phoneNumber,
    postParams.ticketSubject,
    postParams.ticketBody,
  ];

  const result = await query(sqlQuery, sqlVariables);
  return result.rows[0];
}
