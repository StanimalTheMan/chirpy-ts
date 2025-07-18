import type { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { checkPasswordHash, hashPassword } from "../auth.js";
import { NewUser } from "src/db/schema.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;

  if (!params.password || !params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const createdUser = await createUser({
    email: params.email,
    hashedPassword: hashedPassword,
  } satisfies NewUser);

  if (!createdUser) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: createdUser.id,
    email: createdUser.email,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
  } satisfies UserResponse);
}
