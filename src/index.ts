import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics, handlerResetMetrics } from "./api/metrics.js";
import {
  middlewareLogResponse,
  middlewareMetricsInc,
} from "./api/middleware.js";

const app = express();
const PORT = 8080;

app.get("/metrics", handlerMetrics);
app.use(middlewareLogResponse, middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);

app.get("/reset", handlerResetMetrics);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
