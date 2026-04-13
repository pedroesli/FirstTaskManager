import { createClient, RedisClientOptions } from "redis";
import { StorageUnavailableError } from "../errors/storage-unavailable-error";
import { Task } from "../types/task";

const defaultTasks: Task[] = [
  { id: 1, title: "Study TypeScript", done: false },
  { id: 2, title: "Build first API", done: false }
];

const taskIdsKey = "task-manager:tasks:ids";
const nextIdKey = "task-manager:tasks:next-id";

const taskKey = (id: number): string => `task-manager:tasks:${id}`;

const getRedisOptions = (): RedisClientOptions => {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    return { url: redisUrl };
  }

  const port = Number(process.env.REDIS_PORT);
  const database = Number(process.env.REDIS_DB);

  return {
    socket: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number.isInteger(port) ? port : 6379
    },
    password: process.env.REDIS_PASSWORD || undefined,
    database: Number.isInteger(database) ? database : undefined
  };
};

const parseTask = (value: string): Task => JSON.parse(value) as Task;

const sortTaskIds = (ids: string[]): number[] =>
  ids
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id))
    .sort((left, right) => left - right);

const withStorage = async <T>(
  operation: () => Promise<T>,
  message = "Redis is unavailable"
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof StorageUnavailableError) {
      throw error;
    }

    throw new StorageUnavailableError(message, { cause: error });
  }
};

export const redisClient = createClient(getRedisOptions());

redisClient.on("error", (error) => {
  console.error("Redis Client Error", error);
});

const seedDefaultTasks = async (): Promise<void> => {
  const ids = await redisClient.sMembers(taskIdsKey);

  if (ids.length > 0) {
    const nextIdExists = await redisClient.exists(nextIdKey);

    if (nextIdExists === 0) {
      const maxId = Math.max(...sortTaskIds(ids), 0);
      await redisClient.set(nextIdKey, String(maxId));
    }

    return;
  }

  const nextIdExists = await redisClient.exists(nextIdKey);

  if (nextIdExists === 1) {
    return;
  }

  const pipeline = redisClient.multi();

  for (const task of defaultTasks) {
    pipeline.set(taskKey(task.id), JSON.stringify(task));
    pipeline.sAdd(taskIdsKey, String(task.id));
  }

  const maxId = defaultTasks.reduce((currentMax, task) => Math.max(currentMax, task.id), 0);
  pipeline.set(nextIdKey, String(maxId));
  await pipeline.exec();
};

export const initializeTaskStore = async (): Promise<void> => {
  await withStorage(async () => {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    await seedDefaultTasks();
  }, "Failed to initialize Redis");
};

export const getTasks = async (): Promise<Task[]> => {
  return withStorage(async () => {
    const ids = sortTaskIds(await redisClient.sMembers(taskIdsKey));
    const values = await Promise.all(ids.map((id) => redisClient.get(taskKey(id))));

    return values
      .filter((value): value is string => value !== null)
      .map((value) => parseTask(value));
  });
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  return withStorage(async () => {
    const value = await redisClient.get(taskKey(id));
    return value ? parseTask(value) : null;
  });
};

export const createTask = async (title: string): Promise<Task> => {
  return withStorage(async () => {
    const id = await redisClient.incr(nextIdKey);
    const task: Task = {
      id,
      title,
      done: false
    };

    const pipeline = redisClient.multi();
    pipeline.set(taskKey(id), JSON.stringify(task));
    pipeline.sAdd(taskIdsKey, String(id));
    await pipeline.exec();

    return task;
  });
};

export const markTaskDone = async (id: number): Promise<Task | null> => {
  return withStorage(async () => {
    const task = await getTaskById(id);

    if (!task) {
      return null;
    }

    const updatedTask: Task = {
      ...task,
      done: true
    };

    await redisClient.set(taskKey(id), JSON.stringify(updatedTask));
    return updatedTask;
  });
};

export const deleteTask = async (id: number): Promise<boolean> => {
  return withStorage(async () => {
    const deletedCount = await redisClient.del(taskKey(id));

    if (deletedCount === 0) {
      return false;
    }

    await redisClient.sRem(taskIdsKey, String(id));
    return true;
  });
};
