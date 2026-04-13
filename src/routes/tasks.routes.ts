import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  markTaskDone
} from "../data/tasks";

type CreateTaskBody = {
  title?: unknown;
};

const router = Router();

const isValidTitle = (body: CreateTaskBody): body is { title: string } =>
  typeof body.title === "string" && body.title.trim().length > 0;

const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => (req, res, next) => {
  void handler(req, res, next).catch(next);
};

router.get("/", asyncHandler(async (_req: Request, res: Response) => {
  const tasks = await getTasks();
  res.json(tasks);
}));

router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = await getTaskById(id);

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json(task);
}));

router.post("/", asyncHandler(async (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
  const body = req.body;

  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length === 0 ||
    !isValidTitle(body)
  ) {
    res.status(400).json({ message: "Invalid title" });
    return;
  }

  const newTask = await createTask(body.title.trim());
  res.status(201).json(newTask);
}));

router.patch("/:id/done", asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updatedTask = await markTaskDone(id);

  if (!updatedTask) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json(updatedTask);
}));

router.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const removed = await deleteTask(id);

  if (!removed) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json({ message: "Task deleted" });
}));

export default router;
