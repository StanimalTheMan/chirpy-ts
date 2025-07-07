import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
  };

  const params: parameters = req.body;

  if (!params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const createdUser = await createUser({ email: params.email });

  if (!createdUser) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: createdUser.id,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
    email: createdUser.email,
  });
}
