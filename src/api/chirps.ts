import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../error.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
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
