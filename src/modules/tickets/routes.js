import express from "express";
import {
  getAllTicketsController,
  deleteTicketController,
  updateTicketController,
  postTicketController,
} from "./controllers.js";
import {
  deleteTicketValidator,
  updateTicketValidator,
  postTicketValidator,
} from "./validations.js";

const router = express.Router();

router.post("/create", postTicketValidator, postTicketController);
router.get("", getAllTicketsController);
router.delete("/:id", deleteTicketValidator, deleteTicketController);
router.put("/:id", updateTicketValidator, updateTicketController);

export { router };
