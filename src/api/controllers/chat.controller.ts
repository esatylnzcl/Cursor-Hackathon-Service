import { Request, Response, NextFunction } from "express";
import { IChatService } from "../../logic/service/chat/IChatService";
import { ahandler } from "../../decorators/asynchttphandler";
import { Validate } from "../../logic/utils/Validate";
import {
  createSessionSchema,
  sendMessageSchema,
  updateSessionSchema,
} from "../../logic/Validators/chat.validator";
import { ResponseFormat } from "../../logic/models/SuccessResponse";
import { Types } from "mongoose";
import { AuthenticationError } from "../../logic/models/CustomErrors";

export class ChatController {
  constructor(private chatService: IChatService) {}

  @ahandler
  async createSession(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const validatedData = Validate(req.body, createSessionSchema);

    const chatSession = await this.chatService.createSession(
      new Types.ObjectId(session.userId),
      validatedData.title
    );

    res
      .status(201)
      .json(ResponseFormat(chatSession, true, "Chat oturumu oluşturuldu"));
  }

  @ahandler
  async listSessions(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const sessions = await this.chatService.listSessions(
      new Types.ObjectId(session.userId)
    );

    res.json(ResponseFormat(sessions, true, "Chat oturumları getirildi"));
  }

  @ahandler
  async getSessionMessages(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const { id } = req.params;

    const messages = await this.chatService.getSessionMessages(
      new Types.ObjectId(session.userId),
      new Types.ObjectId(id)
    );

    res.json(ResponseFormat(messages, true, "Mesajlar getirildi"));
  }

  @ahandler
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const { id } = req.params;
    const validatedData = Validate(req.body, sendMessageSchema);

    const result = await this.chatService.sendMessage(
      new Types.ObjectId(session.userId),
      new Types.ObjectId(id),
      validatedData.message
    );

    res.json(ResponseFormat(result, true, "Mesaj gönderildi"));
  }

  @ahandler
  async updateSession(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const { id } = req.params;
    const validatedData = Validate(req.body, updateSessionSchema);

    const chatSession = await this.chatService.updateSessionTitle(
      new Types.ObjectId(session.userId),
      new Types.ObjectId(id),
      validatedData.title
    );

    res.json(ResponseFormat(chatSession, true, "Chat oturumu güncellendi"));
  }

  @ahandler
  async deleteSession(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const { id } = req.params;

    const result = await this.chatService.deleteSession(
      new Types.ObjectId(session.userId),
      new Types.ObjectId(id)
    );

    res.json(ResponseFormat({ deleted: result }, true, "Chat oturumu silindi"));
  }
}

