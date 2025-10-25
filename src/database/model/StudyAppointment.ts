import "reflect-metadata";
import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "./User";

export enum AppointmentStatus {
  PENDING = "pending", // Beklemede
  ACCEPTED = "accepted", // Kabul edildi
  REJECTED = "rejected", // Reddedildi
  COMPLETED = "completed", // Tamamlandı
  CANCELLED = "cancelled", // İptal edildi
}

@modelOptions({
  schemaOptions: {
    collection: "study_appointment",
    versionKey: false,
    timestamps: true,
  },
  options: { allowMixed: 0 },
})
export class StudyAppointment {
  public _id!: Types.ObjectId;
  public createdAt!: Date;
  public updatedAt!: Date;

  @prop({ required: true, ref: () => User })
  public from!: Ref<User>; // Randevu talebi gönderen

  @prop({ required: true, ref: () => User })
  public to!: Ref<User>; // Randevu talebi alan

  @prop({ required: true })
  public when!: Date; // Randevu zamanı

  @prop({
    required: true,
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  public status!: AppointmentStatus;

  @prop({ required: false })
  public studyArea?: string; // Çalışılacak alan

  @prop({ required: false })
  public techniqueId?: string; // Kullanılacak çalışma tekniği

  @prop({ required: false })
  public duration?: number; // Tahmini süre (dakika)

  @prop({ required: false })
  public notes?: string; // Ek notlar

  @prop({ required: false })
  public meetingLink?: string; // Online toplantı linki (zoom, meet, vs.)
}

export const StudyAppointmentModel = getModelForClass(StudyAppointment);
