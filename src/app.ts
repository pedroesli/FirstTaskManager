import express from "express";
import { StorageUnavailableError } from "./errors/storage-unavailable-error";
import tasksRouter from "./routes/tasks.routes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/tasks", tasksRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof StorageUnavailableError) {
    res.status(503).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
