import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ChatSession } from "../../../database/model/ChatSession";
import { ChatMessage } from "../../../database/model/ChatMessage";

export interface IChatService {
  createSession(
    userId: Types.ObjectId,
    title?: string
  ): Promise<DocumentType<ChatSession>>;
  
  sendMessage(
    userId: Types.ObjectId,
    sessionId: Types.ObjectId,
    message: string
  ): Promise<{
    userMessage: DocumentType<ChatMessage>;
    assistantMessage: DocumentType<ChatMessage>;
  }>;
  
  getSessionMessages(
    userId: Types.ObjectId,
    sessionId: Types.ObjectId
  ): Promise<DocumentType<ChatMessage>[]>;
  
  listSessions(userId: Types.ObjectId): Promise<DocumentType<ChatSession>[]>;
  
  updateSessionTitle(
    userId: Types.ObjectId,
    sessionId: Types.ObjectId,
    title: string
  ): Promise<DocumentType<ChatSession>>;
  
  deleteSession(userId: Types.ObjectId, sessionId: Types.ObjectId): Promise<boolean>;
}

