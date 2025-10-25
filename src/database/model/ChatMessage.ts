import "reflect-metadata";
import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ChatSession } from "./ChatSession";

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

@modelOptions({
  schemaOptions: {
    collection: "chat_message",
    versionKey: false,
    timestamps: true,
  },
  options: { allowMixed: 0 },
})
export class ChatMessage {
  public _id!: Types.ObjectId;
  public createdAt!: Date;
  public updatedAt!: Date;

  @prop({ required: true, ref: () => ChatSession })
  public sessionId!: Ref<ChatSession>;

  @prop({ required: true, enum: MessageRole })
  public role!: MessageRole;

  @prop({ required: true })
  public content!: string;

  @prop({ required: false })
  public tokens?: number; // Optional: Maliyet takibi için
}

export const ChatMessageModel = getModelForClass(ChatMessage);

