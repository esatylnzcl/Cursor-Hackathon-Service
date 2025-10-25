import "reflect-metadata";
import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "./User";

@modelOptions({
  schemaOptions: {
    collection: "chat_session",
    versionKey: false,
    timestamps: true,
  },
  options: { allowMixed: 0 },
})
export class ChatSession {
  public _id!: Types.ObjectId;
  public createdAt!: Date;
  public updatedAt!: Date;

  @prop({ required: true, ref: () => User })
  public userId!: Ref<User>;

  @prop({ required: true, default: "Yeni Sohbet" })
  public title!: string;

  @prop({ required: true, default: true })
  public isActive!: boolean;
}

export const ChatSessionModel = getModelForClass(ChatSession);

