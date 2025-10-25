import { IAuthService } from "./IAuthService";
import { IUserRepository } from "../../repository/user/IUserRepository";
import { CreateUserArgs } from "../../repository/user/types/createUser";
import { LoginInput } from "../../Validators/auth.validator";
import { CredentialsError, NotFoundError } from "../../models/CustomErrors";
import { hashPassword } from "../../helpers/hashPassword";
import { comparePassword } from "../../helpers/comparePassword";
import { DocumentType } from "@typegoose/typegoose";
import { User } from "../../../database/model/User";

export class AuthService implements IAuthService {
  constructor(private UserRepository: IUserRepository) {}

  async Login(dto: LoginInput): Promise<DocumentType<User>> {
    const user = await this.UserRepository.getUserByEmail(dto.email);

    if (!user) {
      throw new NotFoundError("Email ile eşleşen hesap bulunamadı!");
    }

    if (await comparePassword(dto.password, user.password)) {
      return user;
    }

    throw new CredentialsError("Lütfen doğru şifreyi girdiğinize emin olun.");
  }

  async Register(createArgs: CreateUserArgs): Promise<DocumentType<User>> {
    // Şifreyi hash'le
    createArgs.password = await hashPassword(createArgs.password);

    // Kullanıcıyı oluştur
    const result = await this.UserRepository.createUser(createArgs);

    return result;
  }
}
