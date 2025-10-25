import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ChatSession } from "../../../database/model/ChatSession";

export interface IChatSessionRepository {
  create(userId: Types.ObjectId, title?: string): Promise<DocumentType<ChatSession>>;
  getById(sessionId: Types.ObjectId): Promise<DocumentType<ChatSession> | null>;
  getByUserId(userId: Types.ObjectId): Promise<DocumentType<ChatSession>[]>;
  update(
    sessionId: Types.ObjectId,
    data: Partial<ChatSession>
  ): Promise<DocumentType<ChatSession>>;
  delete(sessionId: Types.ObjectId): Promise<boolean>;
}

