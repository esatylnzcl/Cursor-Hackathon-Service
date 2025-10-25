import { Request, Response, NextFunction } from "express";
import { IUserInfoService } from "../../logic/service/userInfo/IUserInfoService";
import { ahandler } from "../../decorators/asynchttphandler";
import { Validate } from "../../logic/utils/Validate";
import {
  createUserInfoSchema,
  updateUserInfoSchema,
} from "../../logic/Validators/userInfo.validator";
import { ResponseFormat } from "../../logic/models/SuccessResponse";
import { Types } from "mongoose";
import { AuthenticationError } from "../../logic/models/CustomErrors";

export class UserInfoController {
  constructor(private userInfoService: IUserInfoService) {}

  @ahandler
  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const userInfo = await this.userInfoService.getUserInfo(
      new Types.ObjectId(session.userId)
    );

    res.json(
      ResponseFormat(userInfo, true, "Kullanıcı profili başarıyla getirildi")
    );
  }

  @ahandler
  async createUserInfo(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const validatedData = Validate(req.body, createUserInfoSchema);

    const userInfo = await this.userInfoService.createUserInfo(
      new Types.ObjectId(session.userId),
      validatedData
    );

    res
      .status(201)
      .json(
        ResponseFormat(
          userInfo,
          true,
          "Kullanıcı profili başarıyla oluşturuldu"
        )
      );
  }

  @ahandler
  async updateUserInfo(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const validatedData = Validate(req.body, updateUserInfoSchema);

    const userInfo = await this.userInfoService.updateUserInfo(
      new Types.ObjectId(session.userId),
      validatedData
    );

    res.json(
      ResponseFormat(userInfo, true, "Kullanıcı profili başarıyla güncellendi")
    );
  }

  @ahandler
  async deleteUserInfo(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const result = await this.userInfoService.deleteUserInfo(
      new Types.ObjectId(session.userId)
    );

    res.json(
      ResponseFormat({ deleted: result }, true, "Kullanıcı profili silindi")
    );
  }

  @ahandler
  async getAIPrompt(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const prompt = await this.userInfoService.getUserInfoForAIPrompt(
      new Types.ObjectId(session.userId)
    );

    res.json(
      ResponseFormat({ prompt }, true, "AI prompt başarıyla oluşturuldu")
    );
  }
}
