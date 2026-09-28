import { Router } from "express";
import * as tripController from "../controllers/trip.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole";

export const tripRouter = Router();
tripRouter.use(authMiddleware);
tripRouter.get("/", tripController.listTrips);
tripRouter.post("/", requireRole("customer"), tripController.createTrip);
tripRouter.patch("/:tripId/assign", requireRole("admin", "dispatcher"), tripController.assignDriver);
tripRouter.patch("/:tripId/status", requireRole("admin", "dispatcher", "driver"), tripController.updateTripStatus);
