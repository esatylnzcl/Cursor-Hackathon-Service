import bcrypt from "bcryptjs";

/**
 * Şifreyi hash'ler
 * @param password - Hash'lenecek şifre
 * @returns Hash'lenmiş şifre
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
