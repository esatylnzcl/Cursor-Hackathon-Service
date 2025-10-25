import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../../../database/model/User";
import { CreateUserArgs } from "./types/createUser";

export interface IUserRepository {
  getUsers(filter: any): Promise<DocumentType<User>[]>;
  getUserById(id: Types.ObjectId): Promise<DocumentType<User>>;
  getUserByEmail(email: string): Promise<DocumentType<User> | null>;
  createUser(createArgs: CreateUserArgs): Promise<DocumentType<User>>;
  updateUser(
    id: Types.ObjectId,
    updateData: Partial<User>
  ): Promise<DocumentType<User>>;
}
