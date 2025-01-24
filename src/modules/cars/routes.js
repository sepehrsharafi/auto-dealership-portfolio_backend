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
  getSliderController,
  getAllCarsDashboardController,
} from "./controllers.js";
import { uploadImages } from "../../multer/multer.js";

const router = express.Router();

router.get("/admin/:id", getCarsByAdminIdController);

router.get("/dashboard", getAllCarsDashboardController);
router.get("", getAllCarsController);
router.get("/slider", getSliderController);
router.get("/:car_id", getCarByIdValidaitor, getCarByIdController);

router.post("", uploadImages, createCarValidator, createCarController);

router.delete("/:car_id", deleteCarByIdValidator, deleteCarByIdController);

router.put(
  "/:car_id",
  uploadImages,
  updateCarByIdValidator,
  updateCarByIdController
);

export { router };
