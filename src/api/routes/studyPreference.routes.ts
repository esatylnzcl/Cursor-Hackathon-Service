import { NextFunction, Request, Response, Router } from "express";
import { StudyPreferenceController } from "../controllers/studyPreference.controller";
import { StudyPreferenceService } from "../../logic/service/studyPreference/studyPreference.service";
import { StudyPreferenceRepository } from "../../logic/repository/studyPreference/studyPreference.repository";

export const studyPreferenceRouter = Router();

// Dependency Injection
const repository = new StudyPreferenceRepository();
const service = new StudyPreferenceService(repository);
const controller = new StudyPreferenceController(service);

// Routes
studyPreferenceRouter.get(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    controller.getMyPreference(req, res, next)
);

studyPreferenceRouter.post(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    controller.create(req, res, next)
);

studyPreferenceRouter.patch(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    controller.update(req, res, next)
);

studyPreferenceRouter.delete(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    controller.delete(req, res, next)
);

studyPreferenceRouter.get(
  "/matches",
  (req: Request, res: Response, next: NextFunction) =>
    controller.findMatches(req, res, next)
);
