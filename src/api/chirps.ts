import type { Request, Response } from "express";

import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
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
