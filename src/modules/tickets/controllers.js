import {
  deleteTicketService,
  getAllTicketsService,
  updateTicketService,
  postTicketService,
} from "../../services/tickets/service.js";

export async function getAllTicketsController(req, res) {
  const data = await getAllTicketsService();

  try {
    if (data === null) {
      res
        .status(404)
        .json({ message: "there is no ticket to show or an error happend" });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function deleteTicketController(req, res) {
  const ticketId = req.validatedParams.id;
  const deletedResults = await deleteTicketService(ticketId);

  if (deletedResults === null) {
    res.status(424).json({
      message: "there is no ticket to delete or an error happened",
    });
  } else {
    res.status(201).json({
      message: "ticket deleted successfully",
    });
  }
  return deletedResults;
}

export async function updateTicketController(req, res) {
  const ticketId = req.validatedParams.id;
  const updateTicket = await updateTicketService(ticketId);
  if (updateTicket === null) {
    res.status(424).json({
      message: "there is no ticket to update or an error happened",
    });
  } else {
    res.status(201).json({
      message: "ticket updated successfully",
    });
    return updateTicket;
  }
}

export async function postTicketController(req, res) {
  const postParams = req.validatedBody;
  const postTicket = await postTicketService(postParams);

  if (postTicket === null) {
    res.status(424).json({
      message: "Failed to create ticket or an error occurred",
    });
  } else {
    res.status(201).json({
      message: "Ticket created successfully",
      data: postTicket,
    });
  }
}
