import app from "./app";
import { initializeTaskStore } from "./data/tasks";

const port = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  await initializeTaskStore();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

void startServer().catch((error) => {
  console.error("Failed to initialize Redis", error);
  process.exit(1);
});
