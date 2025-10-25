import "reflect-metadata";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({
  schemaOptions: {
    collection: "study_technique",
    versionKey: false,
    timestamps: true,
  },
  options: { allowMixed: 0 },
})
export class StudyTechnique {
  public _id!: Types.ObjectId;
  public createdAt!: Date;
  public updatedAt!: Date;

  @prop({ required: true, unique: true })
  public id!: string; // Örn: "pomodoro", "spaced_repetition"

  @prop({ required: true })
  public name!: string; // Örn: "Pomodoro Tekniği"

  @prop({ required: true })
  public workDuration!: number; // Çalışma süresi (dakika)

  @prop({ required: true })
  public breakDuration!: number; // Mola süresi (dakika)

  @prop({ required: false })
  public description?: string; // Teknik hakkında açıklama
}

export const StudyTechniqueModel = getModelForClass(StudyTechnique);
