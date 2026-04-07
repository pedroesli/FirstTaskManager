import { Router, Request, Response } from "express";
import { tasks } from "../data/tasks";
import { Task } from "../types/task";

type CreateTaskBody = {
  title?: unknown;
};

const router = Router();

const findTaskIndex = (id: number): number =>
  tasks.findIndex((task) => task.id === id);

const getNextId = (): number =>
  tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;

const isValidTitle = (body: CreateTaskBody): body is { title: string } =>
  typeof body.title === "string" && body.title.trim().length > 0;

router.get("/", (_req: Request, res: Response) => {
  res.json(tasks);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json(task);
});

router.post("/", (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
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

  const newTask: Task = {
    id: getNextId(),
    title: body.title.trim(),
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.patch("/:id/done", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const taskIndex = findTaskIndex(id);

  if (taskIndex === -1) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    done: true
  };

  res.json(tasks[taskIndex]);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const taskIndex = findTaskIndex(id);

  if (taskIndex === -1) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted" });
});

export default router;
