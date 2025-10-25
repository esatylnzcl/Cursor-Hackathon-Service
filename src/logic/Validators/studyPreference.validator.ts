import zod from "zod";
import { EducationLevel } from "../../database/model/UserInfo";

export const createStudyPreferenceSchema = zod.object({
  techniqueId: zod.string().min(1, "Çalışma tekniği ID gereklidir"),
  studyArea: zod.string().min(2, "Çalışma alanı en az 2 karakter olmalı"),
  educationLevel: zod.nativeEnum(EducationLevel, {
    message: "Geçerli bir eğitim seviyesi seçiniz",
  }),
  isActive: zod.boolean().optional().default(true),
  maxParticipants: zod.number().int().positive().optional().default(2),
  preferredDays: zod.array(zod.string()).optional(),
  preferredTimeSlots: zod.array(zod.string()).optional(),
});

export const updateStudyPreferenceSchema =
  createStudyPreferenceSchema.partial();

export type CreateStudyPreferenceInput = zod.infer<
  typeof createStudyPreferenceSchema
>;
export type UpdateStudyPreferenceInput = zod.infer<
  typeof updateStudyPreferenceSchema
>;
