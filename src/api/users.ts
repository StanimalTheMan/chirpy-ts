import type { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { checkPasswordHash, hashPassword } from "../auth.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;

  if (!params.password || !params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const createdUser = await createUser({
    email: params.email,
    hashed_password: hashedPassword,
  });

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

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;

  if (!params.password || !params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const user = await getUserByEmail(params.email);

  if (user == null) {
    respondWithError(res, 401, "incorrect email or password");
  }

  if (!(await checkPasswordHash(params.password, user.hashed_password))) {
    respondWithError(res, 401, "incorrect email or password");
  }

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  });
}
