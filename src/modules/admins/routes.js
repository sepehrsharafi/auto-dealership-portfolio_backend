import express from "express";
import {
  getAdminByIdController,
  createAdminController,
  updateAdminDataByIdController,
  loginAdminController,
} from "./controllers.js";

import {
  createAdminValidator,
  updateAdminDataByIdValidator,
} from "./validations.js";
import { authValidationMiddleware } from "../../core/middleware/auth-middlewares.js";

const router = express.Router();

router.get("/admin", authValidationMiddleware, getAdminByIdController);

router.post("/signup", createAdminValidator, createAdminController);
router.post("/signin", loginAdminController);

router.put(
  "/admin",
  authValidationMiddleware,
  updateAdminDataByIdValidator,
  updateAdminDataByIdController
);

export { router };
