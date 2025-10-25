import { NextFunction, Request, Response, Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { AppointmentService } from "../../logic/service/appointment/appointment.service";
import { AppointmentRepository } from "../../logic/repository/appointment/appointment.repository";

export const appointmentRouter = Router();

// Dependency Injection
const repository = new AppointmentRepository();
const service = new AppointmentService(repository);
const controller = new AppointmentController(service);

// Routes
appointmentRouter.post("/", (req: Request, res: Response, next: NextFunction) =>
  controller.create(req, res, next)
);

appointmentRouter.patch(
  "/:id/status",
  (req: Request, res: Response, next: NextFunction) =>
    controller.updateStatus(req, res, next)
);

appointmentRouter.get("/", (req: Request, res: Response, next: NextFunction) =>
  controller.getMyAppointments(req, res, next)
);

appointmentRouter.get(
  "/incoming",
  (req: Request, res: Response, next: NextFunction) =>
    controller.getIncomingRequests(req, res, next)
);

appointmentRouter.get(
  "/outgoing",
  (req: Request, res: Response, next: NextFunction) =>
    controller.getOutgoingRequests(req, res, next)
);

appointmentRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    controller.cancel(req, res, next)
);
