# Task Manager REST API

Small REST API for managing tasks using Node.js, TypeScript, and Express.

## Setup

```bash
npm install
```

Start Redis locally before running the API. By default the app connects to `127.0.0.1:6379`.

You can override the connection with:

- `REDIS_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_DB`

## Run in development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Start production build

```bash
npm start
```

## Endpoints

- `GET /health`
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PATCH /tasks/:id/done`
- `DELETE /tasks/:id`

All task endpoints are backed by Redis.

## Example request body

```json
{
  "title": "Learn Express"
}
```
