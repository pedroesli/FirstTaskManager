# Repository Guidelines

## Project Structure & Module Organization

This repository is a small Express API written in TypeScript. Source code lives in `src/` and is split by responsibility:

- `src/app.ts` creates the Express app and registers middleware/routes.
- `src/server.ts` starts the HTTP server.
- `src/routes/tasks.routes.ts` holds task endpoints.
- `src/types/task.ts` defines shared TypeScript types.
- `src/data/tasks.ts` stores the in-memory task list.

Build output is generated in `dist/`. There are no automated tests yet.

## Build, Test, and Development Commands

- `npm install` installs dependencies.
- `npm run dev` starts the API with `ts-node-dev` and reloads on changes.
- `npm run build` compiles TypeScript into `dist/`.
- `npm start` runs the compiled server from `dist/server.js`.

Use `GET /health` to verify the app is running.

## Coding Style & Naming Conventions

Use TypeScript with `strict` mode enabled. Follow the existing style:

- 2-space indentation
- semicolons at line ends
- double quotes for strings
- `camelCase` for variables and functions
- `PascalCase` for interfaces and types, such as `Task`

Keep route handlers small and move shared logic into `src/data/` or `src/types/` when it improves clarity.

## Testing Guidelines

No test framework is configured yet. If you add tests, place them under a dedicated folder such as `tests/` or alongside source files with a clear suffix like `*.test.ts`. Prefer coverage for route behavior, especially:

- valid and invalid `POST /tasks`
- `404` responses for missing tasks
- `PATCH /tasks/:id/done`

## Commit & Pull Request Guidelines

No Git history is available in this workspace, so no commit convention can be inferred. Use short, imperative commit messages, for example: `Add task validation`.

Pull requests should include:

- a short summary of the API changes
- notes on validation or response-shape changes
- manual verification steps, such as example `curl` calls

## Configuration Tips

Keep task data in memory only. Do not add persistence unless the API contract changes. If you introduce new endpoints, update `README.md` and keep route files organized by resource.

Do not change `package.json` or `tsconfig.json` unless the user explicitly asks for those files to be modified.
