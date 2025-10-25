import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { IStudyPreferenceService } from "./IStudyPreferenceService";
import { IStudyPreferenceRepository } from "../../repository/studyPreference/IStudyPreferenceRepository";
import { UserStudyPreference } from "../../../database/model/UserStudyPreference";
import { NotFoundError } from "../../models/CustomErrors";

export class StudyPreferenceService implements IStudyPreferenceService {
  constructor(private repository: IStudyPreferenceRepository) {}

  async getByUserId(
    userId: Types.ObjectId
  ): Promise<DocumentType<UserStudyPreference> | null> {
    return await this.repository.getByUserId(userId);
  }

  async create(
    userId: Types.ObjectId,
    data: Omit<Partial<UserStudyPreference>, "userId">
  ): Promise<DocumentType<UserStudyPreference>> {
    return await this.repository.create({ ...data, userId });
  }

  async update(
    userId: Types.ObjectId,
    data: Partial<UserStudyPreference>
  ): Promise<DocumentType<UserStudyPreference>> {
    return await this.repository.update(userId, data);
  }

  async delete(userId: Types.ObjectId): Promise<boolean> {
    return await this.repository.delete(userId);
  }

  async findMatches(
    userId: Types.ObjectId
  ): Promise<DocumentType<UserStudyPreference>[]> {
    const userPreference = await this.repository.getByUserId(userId);

    if (!userPreference) {
      throw new NotFoundError(
        "Eşleşme bulmak için önce çalışma tercihinizi oluşturun"
      );
    }

    if (!userPreference.isActive) {
      throw new NotFoundError("Eşleşme için tercihleriniz aktif değil");
    }

    return await this.repository.findMatches(
      userPreference.techniqueId,
      userPreference.studyArea,
      userPreference.educationLevel,
      userId
    );
  }
}
