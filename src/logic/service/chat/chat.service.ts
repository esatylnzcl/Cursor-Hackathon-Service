import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { IChatService } from "./IChatService";
import { IChatSessionRepository } from "../../repository/chat/IChatSessionRepository";
import { IChatMessageRepository } from "../../repository/chat/IChatMessageRepository";
import { IUserInfoService } from "../userInfo/IUserInfoService";
import { ChatSession } from "../../../database/model/ChatSession";
import { ChatMessage, MessageRole } from "../../../database/model/ChatMessage";
import { geminiClient } from "../../utils/GeminiClient";
import { NotFoundError, UnauthorizedError } from "../../models/CustomErrors";

export class ChatService implements IChatService {
  constructor(
    private sessionRepository: IChatSessionRepository,
    private messageRepository: IChatMessageRepository,
    private userInfoService: IUserInfoService
  ) {}

  async createSession(
    userId: Types.ObjectId,
    title?: string
  ): Promise<DocumentType<ChatSession>> {
    return await this.sessionRepository.create(userId, title);
  }

  async sendMessage(
    userId: Types.ObjectId,
    sessionId: Types.ObjectId,
    message: string
  ): Promise<{
    userMessage: DocumentType<ChatMessage>;
    assistantMessage: DocumentType<ChatMessage>;
  }> {
    // 1. Session'ın kullanıcıya ait olduğunu doğrula
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundError("Chat oturumu bulunamadı");
    }

    if (session.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError("Bu chat oturumuna erişim yetkiniz yok");
    }

    // 2. User mesajını kaydet
    const userMessage = await this.messageRepository.create(
      sessionId,
      MessageRole.USER,
      message
    );

    // 3. UserInfo'dan context al
    let userContext = "";
    try {
      userContext = await this.userInfoService.getUserInfoForAIPrompt(userId);
    } catch (error) {
      // UserInfo yoksa default context kullan
      userContext = "Kullanıcı profili: Henüz profil oluşturulmamış.";
    }

    // 4. Gemini'ye gönder
    const aiResponse = await geminiClient.chat(message, userContext);

    // 5. AI cevabını kaydet
    const assistantMessage = await this.messageRepository.create(
      sessionId,
      MessageRole.ASSISTANT,
      aiResponse
    );

    // 6. Session'ın updatedAt'ini güncelle (son aktivite)
    await this.sessionRepository.update(sessionId, { updatedAt: new Date() });

    // 7. Her iki mesajı da döndür
    return {
      userMessage,
      assistantMessage,
    };
  }

  async getSessionMessages(
    userId: Types.ObjectId,
    sessionId: Types.ObjectId
  ): Promise<DocumentType<ChatMessage>[]> {
    // Session'ın kullanıcıya ait olduğunu doğrula
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundError("Chat oturumu bulunamadı");
    }

    if (session.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError("Bu chat oturumuna erişim yetkiniz yok");
    }

    return await this.messageRepository.getBySessionId(sessionId);
  }

  async listSessions(userId: Types.ObjectId): Promise<DocumentType<ChatSession>[]> {
    return await this.sessionRepository.getByUserId(userId);
  }

  async updateSessionTitle(
    userId: Types.ObjectId,
    sessionId: Types.ObjectId,
    title: string
  ): Promise<DocumentType<ChatSession>> {
    // Session'ın kullanıcıya ait olduğunu doğrula
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundError("Chat oturumu bulunamadı");
    }

    if (session.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError("Bu chat oturumuna erişim yetkiniz yok");
    }

    return await this.sessionRepository.update(sessionId, { title });
  }

  async deleteSession(
    userId: Types.ObjectId,
    sessionId: Types.ObjectId
  ): Promise<boolean> {
    // Session'ın kullanıcıya ait olduğunu doğrula
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundError("Chat oturumu bulunamadı");
    }

    if (session.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError("Bu chat oturumuna erişim yetkiniz yok");
    }

    // Mesajları da sil (optional - hard delete)
    await this.messageRepository.deleteBySessionId(sessionId);

    // Session'ı sil (soft delete)
    return await this.sessionRepository.delete(sessionId);
  }
}

