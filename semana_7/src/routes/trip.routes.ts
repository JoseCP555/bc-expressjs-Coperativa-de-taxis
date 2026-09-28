import { Router } from "express";
import * as tripController from "../controllers/trip.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const tripRouter = Router();
tripRouter.use(authMiddleware);
tripRouter.get("/", tripController.listTrips);
tripRouter.post("/", tripController.createTrip);
