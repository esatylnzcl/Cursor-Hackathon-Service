import bcrypt from "bcryptjs";

/**
 * Şifreyi hash ile karşılaştırır
 * @param password - Düz metin şifre
 * @param hashedPassword - Hash'lenmiş şifre
 * @returns Eşleşme durumu
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
