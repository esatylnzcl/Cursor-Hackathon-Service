import zod from "zod";
import { AppointmentStatus } from "../../database/model/StudyAppointment";

export const createAppointmentSchema = zod.object({
  to: zod.string().min(1, "Alıcı kullanıcı ID gereklidir"),
  when: zod.string().datetime("Geçerli bir tarih-saat formatı giriniz"),
  studyArea: zod.string().optional(),
  techniqueId: zod.string().optional(),
  duration: zod.number().int().positive().optional(),
  notes: zod.string().optional(),
  meetingLink: zod.string().url().optional().or(zod.literal("")),
});

export const updateAppointmentStatusSchema = zod.object({
  status: zod.nativeEnum(AppointmentStatus, {
    message: "Geçerli bir durum seçiniz",
  }),
});

export type CreateAppointmentInput = zod.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = zod.infer<
  typeof updateAppointmentStatusSchema
>;
