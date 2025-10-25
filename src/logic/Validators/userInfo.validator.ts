import zod from "zod";
import {
  Gender,
  StudyTactic,
  EducationLevel,
} from "../../database/model/UserInfo";

export const createUserInfoSchema = zod.object({
  gender: zod.nativeEnum(Gender, {
    message: "Geçerli bir cinsiyet seçiniz",
  }),
  studyTactic: zod.nativeEnum(StudyTactic, {
    message: "Geçerli bir çalışma taktiği seçiniz",
  }),
  educationLevel: zod.nativeEnum(EducationLevel, {
    message: "Geçerli bir eğitim seviyesi seçiniz",
  }),
  careerGoal: zod.string().min(3, "Kariyer hedefi en az 3 karakter olmalı"),
  currentStatus: zod.string().min(3, "Mevcut durum en az 3 karakter olmalı"),
  interests: zod.array(zod.string()).optional(),
  weaknesses: zod.array(zod.string()).optional(),
  strengths: zod.array(zod.string()).optional(),
  learningGoals: zod.string().optional(),
  availableStudyTime: zod.string().optional(),
  preferredLanguage: zod.string().optional().default("tr"),
  additionalNotes: zod.string().optional(),
});

export const updateUserInfoSchema = createUserInfoSchema.partial();

export type CreateUserInfoInput = zod.infer<typeof createUserInfoSchema>;
export type UpdateUserInfoInput = zod.infer<typeof updateUserInfoSchema>;
