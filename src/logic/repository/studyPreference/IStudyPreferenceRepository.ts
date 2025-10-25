import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { UserStudyPreference } from "../../../database/model/UserStudyPreference";

export interface IStudyPreferenceRepository {
  getByUserId(
    userId: Types.ObjectId
  ): Promise<DocumentType<UserStudyPreference> | null>;
  create(
    data: Partial<UserStudyPreference>
  ): Promise<DocumentType<UserStudyPreference>>;
  update(
    userId: Types.ObjectId,
    data: Partial<UserStudyPreference>
  ): Promise<DocumentType<UserStudyPreference>>;
  delete(userId: Types.ObjectId): Promise<boolean>;
  findMatches(
    techniqueId: string,
    studyArea: string,
    educationLevel: string,
    excludeUserId: Types.ObjectId
  ): Promise<DocumentType<UserStudyPreference>[]>;
}
