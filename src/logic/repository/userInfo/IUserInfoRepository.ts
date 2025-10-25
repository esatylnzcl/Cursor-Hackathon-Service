import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { UserInfo } from "../../../database/model/UserInfo";
import { CreateUserInfoArgs } from "./types/createUserInfo";

export interface IUserInfoRepository {
  getUserInfoByUserId(
    userId: Types.ObjectId
  ): Promise<DocumentType<UserInfo> | null>;
  createUserInfo(
    createArgs: CreateUserInfoArgs
  ): Promise<DocumentType<UserInfo>>;
  updateUserInfo(
    userId: Types.ObjectId,
    updateData: Partial<UserInfo>
  ): Promise<DocumentType<UserInfo>>;
  deleteUserInfo(userId: Types.ObjectId): Promise<boolean>;
}
