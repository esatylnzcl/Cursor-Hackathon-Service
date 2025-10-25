import { Types } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { IStudyPreferenceRepository } from "./IStudyPreferenceRepository";
import {
  UserStudyPreference,
  UserStudyPreferenceModel,
} from "../../../database/model/UserStudyPreference";
import { NotFoundError, DuplicationError } from "../../models/CustomErrors";

export class StudyPreferenceRepository implements IStudyPreferenceRepository {
  async getByUserId(
    userId: Types.ObjectId
  ): Promise<DocumentType<UserStudyPreference> | null> {
    return await UserStudyPreferenceModel.findOne({ userId });
  }

  async create(
    data: Partial<UserStudyPreference>
  ): Promise<DocumentType<UserStudyPreference>> {
    // Check if preference already exists
    if (data.userId) {
      const existing = await this.getByUserId(data.userId as Types.ObjectId);
      if (existing) {
        throw new DuplicationError(
          { userId: data.userId },
          "Bu kullanıcı için çalışma tercihi zaten mevcut"
        );
      }
    }

    const preference = new UserStudyPreferenceModel(data);
    await preference.save();
    return preference;
  }

  async update(
    userId: Types.ObjectId,
    data: Partial<UserStudyPreference>
  ): Promise<DocumentType<UserStudyPreference>> {
    const preference = await UserStudyPreferenceModel.findOneAndUpdate(
      { userId },
      data,
      { new: true }
    );

    if (!preference) {
      throw new NotFoundError("Güncellenecek çalışma tercihi bulunamadı");
    }

    return preference;
  }

  async delete(userId: Types.ObjectId): Promise<boolean> {
    const result = await UserStudyPreferenceModel.deleteOne({ userId });
    return result.deletedCount > 0;
  }

  async findMatches(
    techniqueId: string,
    studyArea: string,
    educationLevel: string,
    excludeUserId: Types.ObjectId
  ): Promise<DocumentType<UserStudyPreference>[]> {
    return await UserStudyPreferenceModel.find({
      techniqueId,
      studyArea,
      educationLevel,
      isActive: true,
      userId: { $ne: excludeUserId },
    }).populate("userId", "firstName lastName email");
  }
}
