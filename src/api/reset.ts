import type { Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";
import { UserForbiddenError } from "./errors.js";

export async function handlerReset(_: Request, res: Response) {
  if (config.api.platform !== "dev") {
    console.log(config.api.platform);
    throw new UserForbiddenError(
      "Reset is only allowed in the dev environment."
    );
  }
  config.api.fileServerHits = 0;
  await deleteAllUsers();

  res.write("Hits reset to 0");
  res.end();
}
