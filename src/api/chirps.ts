import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new Error("Chirp is too long");
  }

  // check for profane words
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  const words = params.body.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (profaneWords.includes(words[i].toLowerCase())) {
      words[i] = "****";
    }
  }

  respondWithJSON(res, 200, {
    cleanedBody: words.join(" "),
  });
}
