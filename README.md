# Task Manager REST API

Small REST API for managing tasks using Node.js, TypeScript, and Express.

## Setup

```bash
npm install
```

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

## Example request body

```json
{
  "title": "Learn Express"
}
```
