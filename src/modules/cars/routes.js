import express from "express";

import {
  getCarByIdValidaitor,
  createCarValidator,
  deleteCarByIdValidator,
  updateCarByIdValidator,
} from "./validations.js";
import {
  getCarsByAdminIdController,
  getCarByIdController,
  createCarController,
  deleteCarByIdController,
  updateCarByIdController,
  getAllCarsController,
} from "./controllers.js";
const router = express.Router();

router.get("", getAllCarsController);
router.get("/admin/:id", getCarsByAdminIdController);

router.get("/:id", getCarByIdValidaitor, getCarByIdController);

router.post("", createCarValidator, createCarController);

router.delete("/:id", deleteCarByIdValidator, deleteCarByIdController);

router.put("/:id", updateCarByIdValidator, updateCarByIdController);

export { router };
