import { Types } from "mongoose";
import { IUserInfoRepository } from "./IUserInfoRepository";
import { UserInfo, UserInfoModel } from "../../../database/model/UserInfo";
import { CreateUserInfoArgs } from "./types/createUserInfo";
import { DocumentType } from "@typegoose/typegoose";
import { NotFoundError, DuplicationError } from "../../models/CustomErrors";

export class UserInfoRepository implements IUserInfoRepository {
  async getUserInfoByUserId(
    userId: Types.ObjectId
  ): Promise<DocumentType<UserInfo> | null> {
    const userInfo = await UserInfoModel.findOne({ userId: userId });
    return userInfo;
  }

  async createUserInfo(
    createArgs: CreateUserInfoArgs
  ): Promise<DocumentType<UserInfo>> {
    // Check if user info already exists
    const existingInfo = await this.getUserInfoByUserId(createArgs.userId);
    if (existingInfo) {
      throw new DuplicationError(
        { userId: createArgs.userId },
        "Bu kullanıcı için profil bilgisi zaten mevcut"
      );
    }

    const userInfo = new UserInfoModel(createArgs);
    await userInfo.save();
    return userInfo;
  }

  async updateUserInfo(
    userId: Types.ObjectId,
    updateData: Partial<UserInfo>
  ): Promise<DocumentType<UserInfo>> {
    const userInfo = await UserInfoModel.findOneAndUpdate(
      { userId: userId },
      updateData,
      { new: true }
    );

    if (!userInfo) {
      throw new NotFoundError("Güncellenecek kullanıcı profili bulunamadı");
    }

    return userInfo;
  }

  async deleteUserInfo(userId: Types.ObjectId): Promise<boolean> {
    const result = await UserInfoModel.deleteOne({ userId: userId });
    return result.deletedCount > 0;
  }
}
