import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { UserInfo } from "../../../database/model/UserInfo";
import { CreateUserInfoArgs } from "../../repository/userInfo/types/createUserInfo";

export interface IUserInfoService {
  getUserInfo(userId: Types.ObjectId): Promise<DocumentType<UserInfo> | null>;
  createUserInfo(
    userId: Types.ObjectId,
    createArgs: Omit<CreateUserInfoArgs, "userId">
  ): Promise<DocumentType<UserInfo>>;
  updateUserInfo(
    userId: Types.ObjectId,
    updateData: Partial<UserInfo>
  ): Promise<DocumentType<UserInfo>>;
  deleteUserInfo(userId: Types.ObjectId): Promise<boolean>;
  getUserInfoForAIPrompt(userId: Types.ObjectId): Promise<string>;
}
