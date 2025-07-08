import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp, getAllChirps } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string;
  };

  const params: parameters = req.body;

  if (!params.body || !params.userId) {
    throw new BadRequestError("Missing required fields");
  }

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`
    );
  }

  // check for profane words
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  const words = params.body.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (profaneWords.includes(words[i].toLowerCase())) {
      words[i] = "****";
    }
  }

  const createdChirp = await createChirp({
    body: params.body,
    userId: params.userId,
  });

  if (!createdChirp) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: createdChirp.id,
    createdAt: createdChirp.createdAt,
    updatedAt: createdChirp.updatedAt,
    body: createdChirp.body,
    userId: createdChirp.userId,
  });
}

export async function handlerGetAllChirps(req: Request, res: Response) {
  const chirps = await getAllChirps();
  respondWithJSON(res, 200, chirps);
}
