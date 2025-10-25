import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../../logic/service/auth/auth.service";
import { UserRepository } from "../../logic/repository/user/user.repository";
import { IUserRepository } from "../../logic/repository/user/IUserRepository";
import { IAuthService } from "../../logic/service/auth/IAuthService";

export const authRouter = Router();

// Dependency Injection
const repository: IUserRepository = new UserRepository();
const authService: IAuthService = new AuthService(repository);
const authController = new AuthController(authService);

// Routes - Method binding because of DI
authRouter.post("/login", (req: Request, res: Response, next: NextFunction) =>
  authController.Login(req, res, next)
);

authRouter.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) =>
    authController.Register(req, res, next)
);

authRouter.delete(
  "/logout",
  (req: Request, res: Response, next: NextFunction) =>
    authController.Logout(req, res, next)
);

authRouter.get("/check", (req: Request, res: Response, next: NextFunction) =>
  authController.Check(req, res, next)
);
