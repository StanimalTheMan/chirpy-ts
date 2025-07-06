import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
  };

  const params: parameters = req.body;
  const createdUser = await createUser({ email: params.email });

  respondWithJSON(res, 201, {
    id: createdUser.id,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
    email: createdUser.email,
  });
}
