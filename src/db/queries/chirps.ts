import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllChirps() {
  const result = await db.select().from(chirps).orderBy(chirps.createdAt);
  return result;
}

export async function getChirp(chirpId: string) {
  const result = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  return result[0];
}
