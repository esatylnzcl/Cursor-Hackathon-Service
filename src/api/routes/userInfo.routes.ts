import { NextFunction, Request, Response, Router } from "express";
import { UserInfoController } from "../controllers/userInfo.controller";
import { UserInfoService } from "../../logic/service/userInfo/userInfo.service";
import { UserInfoRepository } from "../../logic/repository/userInfo/userInfo.repository";
import { IUserInfoRepository } from "../../logic/repository/userInfo/IUserInfoRepository";
import { IUserInfoService } from "../../logic/service/userInfo/IUserInfoService";

export const userInfoRouter = Router();

// Dependency Injection
const repository: IUserInfoRepository = new UserInfoRepository();
const userInfoService: IUserInfoService = new UserInfoService(repository);
const userInfoController = new UserInfoController(userInfoService);

// Routes - Method binding because of DI
userInfoRouter.get("/", (req: Request, res: Response, next: NextFunction) =>
  userInfoController.getUserInfo(req, res, next)
);

userInfoRouter.post("/", (req: Request, res: Response, next: NextFunction) =>
  userInfoController.createUserInfo(req, res, next)
);

userInfoRouter.patch("/", (req: Request, res: Response, next: NextFunction) =>
  userInfoController.updateUserInfo(req, res, next)
);

userInfoRouter.delete("/", (req: Request, res: Response, next: NextFunction) =>
  userInfoController.deleteUserInfo(req, res, next)
);

userInfoRouter.get(
  "/ai-prompt",
  (req: Request, res: Response, next: NextFunction) =>
    userInfoController.getAIPrompt(req, res, next)
);
