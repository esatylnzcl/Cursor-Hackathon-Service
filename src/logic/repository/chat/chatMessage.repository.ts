import { Types } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { IChatMessageRepository } from "./IChatMessageRepository";
import {
  ChatMessage,
  ChatMessageModel,
  MessageRole,
} from "../../../database/model/ChatMessage";

export class ChatMessageRepository implements IChatMessageRepository {
  async create(
    sessionId: Types.ObjectId,
    role: MessageRole,
    content: string,
    tokens?: number
  ): Promise<DocumentType<ChatMessage>> {
    const message = new ChatMessageModel({
      sessionId,
      role,
      content,
      tokens,
    });

    await message.save();
    return message;
  }

  async getBySessionId(
    sessionId: Types.ObjectId
  ): Promise<DocumentType<ChatMessage>[]> {
    return await ChatMessageModel.find({ sessionId }).sort({ createdAt: 1 });
  }

  async deleteBySessionId(sessionId: Types.ObjectId): Promise<boolean> {
    const result = await ChatMessageModel.deleteMany({ sessionId });
    return result.deletedCount > 0;
  }
}

