import { DocumentType } from "@typegoose/typegoose";
import { User } from "../../../database/model/User";
import { CreateUserArgs } from "../../repository/user/types/createUser";
import { LoginInput } from "../../Validators/auth.validator";

export interface IAuthService {
  Login(dto: LoginInput): Promise<DocumentType<User>>;
  Register(createArgs: CreateUserArgs): Promise<DocumentType<User>>;
}
