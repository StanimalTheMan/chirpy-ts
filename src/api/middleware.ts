import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../error.js";

export function middlewareLogResponse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );
    }
  });

  next();
}

export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction
) {
  config.fileserverHits++;
  next();
}

export function errorMiddleware(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  if (err instanceof BadRequestError) {
    respondWithError(res, 400, err.message);
  } else if (err instanceof UnauthorizedError) {
    respondWithError(res, 401, err.message);
  } else if (err instanceof ForbiddenError) {
    respondWithError(res, 403, err.message);
  } else if (err instanceof NotFoundError) {
    respondWithError(res, 404, err.message);
  } else {
    let statusCode = 500;
    let message = "Something went wrong on our end";

    respondWithError(res, statusCode, message);
  }
}
