import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ChatMessage, MessageRole } from "../../../database/model/ChatMessage";

export interface IChatMessageRepository {
  create(
    sessionId: Types.ObjectId,
    role: MessageRole,
    content: string,
    tokens?: number
  ): Promise<DocumentType<ChatMessage>>;
  getBySessionId(sessionId: Types.ObjectId): Promise<DocumentType<ChatMessage>[]>;
  deleteBySessionId(sessionId: Types.ObjectId): Promise<boolean>;
}

