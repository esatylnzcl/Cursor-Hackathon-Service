import zod from "zod";

export const registerSchema = zod.object({
  firstName: zod.string().min(2, "İsim en az 2 karakter olmalı"),
  lastName: zod.string().min(2, "Soyisim en az 2 karakter olmalı"),
  email: zod.string().email("Geçerli bir email adresi giriniz"),
  password: zod.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export const loginSchema = zod.object({
  email: zod.string().email("Geçerli bir email adresi giriniz"),
  password: zod.string().min(1, "Şifre gereklidir"),
});

export type RegisterInput = zod.infer<typeof registerSchema>;
export type LoginInput = zod.infer<typeof loginSchema>;
