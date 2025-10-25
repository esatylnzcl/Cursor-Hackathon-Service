import zod from "zod";

export const createSessionSchema = zod.object({
  title: zod.string().min(1).max(100).optional(),
});

export const sendMessageSchema = zod.object({
  message: zod.string().min(1, "Mesaj boş olamaz").max(5000, "Mesaj çok uzun"),
});

export const updateSessionSchema = zod.object({
  title: zod.string().min(1).max(100),
});

export type CreateSessionInput = zod.infer<typeof createSessionSchema>;
export type SendMessageInput = zod.infer<typeof sendMessageSchema>;
export type UpdateSessionInput = zod.infer<typeof updateSessionSchema>;

