import express from "express";
import tasksRouter from "./routes/tasks.routes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/tasks", tasksRouter);

export default app;
