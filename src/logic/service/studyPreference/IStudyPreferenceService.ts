import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { UserStudyPreference } from "../../../database/model/UserStudyPreference";

export interface IStudyPreferenceService {
  getByUserId(
    userId: Types.ObjectId
  ): Promise<DocumentType<UserStudyPreference> | null>;
  create(
    userId: Types.ObjectId,
    data: Omit<Partial<UserStudyPreference>, "userId">
  ): Promise<DocumentType<UserStudyPreference>>;
  update(
    userId: Types.ObjectId,
    data: Partial<UserStudyPreference>
  ): Promise<DocumentType<UserStudyPreference>>;
  delete(userId: Types.ObjectId): Promise<boolean>;
  findMatches(
    userId: Types.ObjectId
  ): Promise<DocumentType<UserStudyPreference>[]>;
}
