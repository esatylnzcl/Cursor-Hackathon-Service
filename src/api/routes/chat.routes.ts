import { NextFunction, Request, Response, Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { ChatService } from "../../logic/service/chat/chat.service";
import { ChatSessionRepository } from "../../logic/repository/chat/chatSession.repository";
import { ChatMessageRepository } from "../../logic/repository/chat/chatMessage.repository";
import { UserInfoService } from "../../logic/service/userInfo/userInfo.service";
import { UserInfoRepository } from "../../logic/repository/userInfo/userInfo.repository";

export const chatRouter = Router();

// Dependency Injection
const sessionRepository = new ChatSessionRepository();
const messageRepository = new ChatMessageRepository();
const userInfoRepository = new UserInfoRepository();
const userInfoService = new UserInfoService(userInfoRepository);
const chatService = new ChatService(
  sessionRepository,
  messageRepository,
  userInfoService
);
const chatController = new ChatController(chatService);

// Routes
chatRouter.post(
  "/sessions",
  (req: Request, res: Response, next: NextFunction) =>
    chatController.createSession(req, res, next)
);

chatRouter.get(
  "/sessions",
  (req: Request, res: Response, next: NextFunction) =>
    chatController.listSessions(req, res, next)
);

chatRouter.get(
  "/sessions/:id",
  (req: Request, res: Response, next: NextFunction) =>
    chatController.getSessionMessages(req, res, next)
);

chatRouter.post(
  "/sessions/:id/messages",
  (req: Request, res: Response, next: NextFunction) =>
    chatController.sendMessage(req, res, next)
);

chatRouter.patch(
  "/sessions/:id",
  (req: Request, res: Response, next: NextFunction) =>
    chatController.updateSession(req, res, next)
);

chatRouter.delete(
  "/sessions/:id",
  (req: Request, res: Response, next: NextFunction) =>
    chatController.deleteSession(req, res, next)
);

