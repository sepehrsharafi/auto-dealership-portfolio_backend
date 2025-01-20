import {
  getAllTickets,
  deleteTicketById,
  updateTicketById,
  postTicket,
} from "../../models/tickets/index.js";

export async function getAllTicketsService() {
  const tickets = await getAllTickets();

  if (tickets.length <= 0 || tickets === null || tickets === undefined) {
    return null;
  }

  return tickets;
}

export async function deleteTicketService(ticketId) {
  const deleteTicket = await deleteTicketById(ticketId);
  if (
    deleteTicket.length <= 0 ||
    deleteTicket === null ||
    deleteTicket === undefined
  ) {
    return null;
  }
  return deleteTicket;
}

export async function updateTicketService(ticketId) {
  const updateTicket = await updateTicketById(ticketId);
  if (
    updateTicket.length <= 0 ||
    updateTicket === null ||
    updateTicket === undefined
  ) {
    return null;
  }
  return updateTicket;
}

export async function postTicketService(postParams) {
  const newTicket = await postTicket(postParams);
  if (newTicket.length <= 0 || newTicket === null || newTicket === undefined) {
    return null;
  }
  return newTicket;
}
