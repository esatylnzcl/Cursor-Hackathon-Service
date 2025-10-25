import { Types } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { IChatSessionRepository } from "./IChatSessionRepository";
import { ChatSession, ChatSessionModel } from "../../../database/model/ChatSession";
import { NotFoundError } from "../../models/CustomErrors";

export class ChatSessionRepository implements IChatSessionRepository {
  async create(
    userId: Types.ObjectId,
    title?: string
  ): Promise<DocumentType<ChatSession>> {
    const session = new ChatSessionModel({
      userId,
      title: title || "Yeni Sohbet",
      isActive: true,
    });

    await session.save();
    return session;
  }

  async getById(sessionId: Types.ObjectId): Promise<DocumentType<ChatSession> | null> {
    return await ChatSessionModel.findById(sessionId);
  }

  async getByUserId(userId: Types.ObjectId): Promise<DocumentType<ChatSession>[]> {
    return await ChatSessionModel.find({ userId, isActive: true }).sort({
      updatedAt: -1,
    });
  }

  async update(
    sessionId: Types.ObjectId,
    data: Partial<ChatSession>
  ): Promise<DocumentType<ChatSession>> {
    const session = await ChatSessionModel.findByIdAndUpdate(sessionId, data, {
      new: true,
    });

    if (!session) {
      throw new NotFoundError("Chat oturumu bulunamadı");
    }

    return session;
  }

  async delete(sessionId: Types.ObjectId): Promise<boolean> {
    // Soft delete
    const result = await ChatSessionModel.findByIdAndUpdate(sessionId, {
      isActive: false,
    });
    return !!result;
  }
}

