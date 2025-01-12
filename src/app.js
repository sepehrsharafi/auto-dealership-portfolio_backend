import express from "express";
import { router as carsRouter } from "./modules/cars/routes.js";
import { router as adminRouter } from "./modules/admins/routes.js";
import { EXPRESS_APP } from "./core/config/index.js";
import { apiLogger, routeNotFound } from "./core/middleware/middlewares.js";
import { authValidationMiddleware } from "./core/middleware/auth-middlewares.js";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(apiLogger);

app.use("/api/cars", carsRouter);
app.use("/api", adminRouter);
app.use(routeNotFound);
const port = EXPRESS_APP.port;
app.listen(port, () => {
  console.log(`dealership app runing on port ${port}`);
});
