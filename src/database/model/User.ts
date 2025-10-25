import "reflect-metadata";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({
  schemaOptions: {
    collection: "user",
    versionKey: false,
    timestamps: true,
  },
  options: { allowMixed: 0 },
})
export class User {
  public _id!: Types.ObjectId;
  public createdAt!: Date;
  public updatedAt!: Date;

  @prop({ required: true })
  public firstName!: string;

  @prop({ required: true })
  public lastName!: string;

  @prop({ required: true, unique: true, match: /^[1-9][0-9]{10}$/ })
  public identityNumber!: string;

  @prop({
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true, default: false })
  public isDeleted!: boolean;
}

export const UserModel = getModelForClass(User);
