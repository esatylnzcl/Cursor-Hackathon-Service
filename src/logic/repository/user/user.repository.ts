import { Types } from "mongoose";
import { IUserRepository } from "./IUserRepository";
import { User, UserModel } from "../../../database/model/User";
import { CreateUserArgs } from "./types/createUser";
import { DocumentType } from "@typegoose/typegoose";
import { CredentialsError, NotFoundError } from "../../models/CustomErrors";

export class UserRepository implements IUserRepository {
  async getUsers(filter: any): Promise<DocumentType<User>[]> {
    const users = await UserModel.find(filter);
    if (!users) throw new NotFoundError("Kayıt bulunamadı");
    return users;
  }

  async getUserById(id: Types.ObjectId): Promise<DocumentType<User>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new CredentialsError("Geçersiz Id");
    }

    const user = await UserModel.findById(id);

    if (!user) {
      throw new NotFoundError("Kullanıcı bulunamadı");
    }

    return user;
  }

  async createUser(createArgs: CreateUserArgs): Promise<DocumentType<User>> {
    const user = new UserModel({ ...createArgs });
    await user.save();
    return user;
  }

  async getUserByEmail(email: string): Promise<DocumentType<User> | null> {
    const user = await UserModel.findOne({ email: email });
    return user;
  }

  async updateUser(
    id: Types.ObjectId,
    updateData: Partial<User>
  ): Promise<DocumentType<User>> {
    const user = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!user) throw new NotFoundError("Güncellenecek kullanıcı bulunamadı");

    return user;
  }
}
