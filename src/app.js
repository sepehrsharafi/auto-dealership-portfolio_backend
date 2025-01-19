import express from "express";
import { router as carsRouter } from "./modules/cars/routes.js";
import { router as adminRouter } from "./modules/admins/routes.js";
import { router as ticketsRouter } from "./modules/tickets/routes.js";
import { EXPRESS_APP } from "./core/config/index.js";
import { apiLogger, routeNotFound } from "./core/middleware/middlewares.js";
import { authValidationMiddleware } from "./core/middleware/auth-middlewares.js";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

app.use(express.json());
app.use(apiLogger);

app.use("/api/tickets", ticketsRouter);
app.use("/api/cars", carsRouter);
app.use("/api", adminRouter);
app.use(routeNotFound);
const port = EXPRESS_APP.port;
app.listen(port, () => {
  console.log(`dealership app runing on port ${port}`);
});
