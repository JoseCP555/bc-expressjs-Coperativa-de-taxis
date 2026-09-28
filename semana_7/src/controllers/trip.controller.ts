import type { RequestHandler } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError";
import { TripModel } from "../models/Trip";
import { UserModel } from "../models/User";
import { createTripSchema, updateTripStatusSchema } from "../schemas/trip.schema";
import { asyncHandler } from "../utils/asyncHandler";

export const createTrip: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Debes iniciar sesión.", 401);
  const input = createTripSchema.parse(req.body);
  const trip = await TripModel.create({ ...input, createdBy: req.user.id, status: "requested" });
  res.status(201).json({ trip });
});

export const listTrips: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Debes iniciar sesión.", 401);
  let filter = {};
  if (req.user.role === "customer") filter = { createdBy: req.user.id };
  if (req.user.role === "driver") filter = { driverId: req.user.id };
  const trips = await TripModel.find(filter).sort({ createdAt: -1 }).populate("driverId", "name email");
  res.status(200).json({ trips });
});

export const assignDriver: RequestHandler = asyncHandler(async (req, res) => {
  const trip = await TripModel.findById(String(req.params.tripId));
  if (!trip) throw new AppError("Servicio no encontrado.", 404);
  const driverId = String(req.body.driverId ?? "");
  if (!mongoose.isValidObjectId(driverId)) throw new AppError("El identificador del conductor no es válido.", 400);
  const driver = await UserModel.findOne({ _id: driverId, role: "driver" });
  if (!driver) throw new AppError("Solo se puede asignar un usuario con rol conductor.", 400);
  trip.driverId = driver._id;
  trip.status = "assigned";
  await trip.save();
  res.status(200).json({ trip });
});

export const updateTripStatus: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Debes iniciar sesión.", 401);
  const { status } = updateTripStatusSchema.parse(req.body);
  const trip = await TripModel.findById(String(req.params.tripId));
  if (!trip) throw new AppError("Servicio no encontrado.", 404);
  if (req.user.role === "driver" && String(trip.driverId ?? "") !== req.user.id) {
    throw new AppError("Solo puedes actualizar servicios asignados a tu cuenta.", 403);
  }
  const transitions: Record<string, string[]> = {
    requested: ["cancelled"], assigned: ["in_progress", "cancelled"], in_progress: ["completed", "cancelled"], completed: [], cancelled: []
  };
  if (!transitions[trip.status]?.includes(status)) throw new AppError("Ese cambio de estado no está permitido.", 409);
  trip.status = status;
  await trip.save();
  res.status(200).json({ trip });
});
