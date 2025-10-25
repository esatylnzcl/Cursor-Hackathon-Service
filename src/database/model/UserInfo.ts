import "reflect-metadata";
import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "./User";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum EducationLevel {
  PRIMARY_SCHOOL = "primary_school",
  MIDDLE_SCHOOL = "middle_school",
  HIGH_SCHOOL = "high_school",
  UNDERGRADUATE = "undergraduate",
  GRADUATE = "graduate",
  DOCTORATE = "doctorate",
  OTHER = "other",
}

@modelOptions({
  schemaOptions: {
    collection: "user_info",
    versionKey: false,
    timestamps: true,
  },
  options: { allowMixed: 0 },
})
export class UserInfo {
  public _id!: Types.ObjectId;
  public createdAt!: Date;
  public updatedAt!: Date;

  @prop({ required: true, ref: () => User, unique: true })
  public userId!: Ref<User>;

  @prop({ required: true, enum: Gender })
  public gender!: Gender;

  @prop({ required: true, enum: EducationLevel })
  public educationLevel!: EducationLevel;

  @prop({ required: true })
  public careerGoal!: string; // Ne olmak istiyor

  @prop({ required: true })
  public currentStatus!: string; // Şu anki durumu (örn: "Üniversite 2. sınıf öğrencisi", "Mezun, iş arıyorum")

  @prop({ required: false })
  public interests?: string[]; // İlgi alanları (örn: ["Matematik", "Fizik", "Programlama"])

  @prop({ required: false })
  public weaknesses?: string[]; // Zayıf olduğu konular

  @prop({ required: false })
  public strengths?: string[]; // Güçlü olduğu konular

  @prop({ required: false })
  public learningGoals?: string; // Öğrenme hedefleri

  @prop({ required: false })
  public availableStudyTime?: string; // Müsait çalışma zamanı (örn: "Haftada 10 saat")

  @prop({ required: false })
  public preferredLanguage?: string; // Tercih edilen dil (Türkçe, İngilizce)

  @prop({ required: false })
  public additionalNotes?: string; // Ek notlar
}

export const UserInfoModel = getModelForClass(UserInfo);
