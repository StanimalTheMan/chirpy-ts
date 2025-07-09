import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function checkPasswordHash(password: string, hash: string) {
  const match = await bcrypt.compare(password, hash);
  console.log(password, hash, match);
  return match;
}
