import express from "express";
import { router as carsRouter } from "./modules/cars/routes.js";
import { router as adminRouter } from "./modules/admins/routes.js";
import { EXPRESS_APP } from "./core/config/index.js";
import { apiLogger, routeNotFound } from "./core/middleware/middlewares.js";

//Todo: add auth validation on car routes later...
import { authValidationMiddleware } from "./core/middleware/auth-middlewares.js";

import cors from "cors";
import multer from "multer";

const app = express();

// // CORS configuration
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiLogger);

app.use("/api/cars", carsRouter);
app.use("/api", adminRouter);

app.use(routeNotFound);

// Global error handler for multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
});

const port = EXPRESS_APP.port;
app.listen(port, () => {
  console.log(`Dealership app running on port ${port}`);
});
