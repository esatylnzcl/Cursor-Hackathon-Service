import "reflect-metadata";
import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "./User";
import { EducationLevel } from "./UserInfo";

@modelOptions({
  schemaOptions: {
    collection: "user_study_preference",
    versionKey: false,
    timestamps: true,
  },
  options: { allowMixed: 0 },
})
export class UserStudyPreference {
  public _id!: Types.ObjectId;
  public createdAt!: Date;
  public updatedAt!: Date;

  @prop({ required: true, ref: () => User, unique: true })
  public userId!: Ref<User>;

  @prop({ required: true })
  public techniqueId!: string; // Çalışma tekniği ID (örn: "pomodoro")

  @prop({ required: true })
  public studyArea!: string; // Çalışma alanı (örn: "İngilizce", "Matematik")

  @prop({ required: true, enum: EducationLevel })
  public educationLevel!: EducationLevel; // Eğitim seviyesi

  @prop({ required: true, default: true })
  public isActive!: boolean; // Eşleşmeye açık mı?

  @prop({ required: false })
  public maxParticipants?: number; // Maksimum katılımcı sayısı (varsayılan: 2)

  @prop({ required: false })
  public preferredDays?: string[]; // Tercih edilen günler ["monday", "tuesday"]

  @prop({ required: false })
  public preferredTimeSlots?: string[]; // Tercih edilen zaman dilimleri ["09:00-12:00", "14:00-17:00"]
}

export const UserStudyPreferenceModel = getModelForClass(UserStudyPreference);
