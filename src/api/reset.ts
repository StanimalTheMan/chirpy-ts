import type { Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";
import { UserForbiddenError } from "./errors.js";

export async function handlerReset(_: Request, res: Response) {
  if (config.api.platform !== "dev") {
    throw new UserForbiddenError("forbidden");
  }
  await deleteAllUsers();
  res.write("all users deleted");
  res.end();
  // config.api.fileServerHits = 0;
  // res.write("Hits reset to 0");
  // res.end();
}
