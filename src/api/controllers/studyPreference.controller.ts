import { Request, Response, NextFunction } from "express";
import { IStudyPreferenceService } from "../../logic/service/studyPreference/IStudyPreferenceService";
import { ahandler } from "../../decorators/asynchttphandler";
import { Validate } from "../../logic/utils/Validate";
import {
  createStudyPreferenceSchema,
  updateStudyPreferenceSchema,
} from "../../logic/Validators/studyPreference.validator";
import { ResponseFormat } from "../../logic/models/SuccessResponse";
import { Types } from "mongoose";
import { AuthenticationError } from "../../logic/models/CustomErrors";

export class StudyPreferenceController {
  constructor(private service: IStudyPreferenceService) {}

  @ahandler
  async getMyPreference(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const preference = await this.service.getByUserId(
      new Types.ObjectId(session.userId)
    );

    res.json(ResponseFormat(preference, true, "Tercihler getirildi"));
  }

  @ahandler
  async create(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const validatedData = Validate(req.body, createStudyPreferenceSchema);

    const preference = await this.service.create(
      new Types.ObjectId(session.userId),
      validatedData
    );

    res
      .status(201)
      .json(ResponseFormat(preference, true, "Tercihler oluşturuldu"));
  }

  @ahandler
  async update(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const validatedData = Validate(req.body, updateStudyPreferenceSchema);

    const preference = await this.service.update(
      new Types.ObjectId(session.userId),
      validatedData
    );

    res.json(ResponseFormat(preference, true, "Tercihler güncellendi"));
  }

  @ahandler
  async delete(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const result = await this.service.delete(
      new Types.ObjectId(session.userId)
    );

    res.json(ResponseFormat({ deleted: result }, true, "Tercihler silindi"));
  }

  @ahandler
  async findMatches(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const matches = await this.service.findMatches(
      new Types.ObjectId(session.userId)
    );

    res.json(
      ResponseFormat(matches, true, `${matches.length} eşleşme bulundu`)
    );
  }
}
