import type { Request, Response } from "express";

export function handlerValidateChirp(req: Request, res: Response) {
  let body = "";

  // 2. Listen for data events
  req.on("data", (chunk) => {
    body += chunk;
  });

  type responseData = {
    valid: boolean;
  };

  type errorResponseData = {
    error: string;
  };

  // 3. Listen for end events
  req.on("end", () => {
    try {
      const parsedBody = JSON.parse(body);
      // check for length of chirp
      if (parsedBody.body.length > 140) {
        const errorRespBody: errorResponseData = {
          error: "Chirp is too long",
        };
        res.header("Content-Type", "application/json");
        res.status(400).send(JSON.stringify(errorRespBody));
      } else {
        const respBody: responseData = {
          valid: true,
        };

        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(respBody));
      }
    } catch (error) {
      const errorRespBody: errorResponseData = {
        error: "Something went wrong",
      };
      res.header("Content-Type", "application/json");
      res.status(400).send(JSON.stringify(errorRespBody));
      res.end();
    }
  });
}
