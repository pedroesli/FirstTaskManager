# Task Manager API Endpoints

Base URL:

```text
http://localhost:3000
```

## Data Model

Tasks are stored in memory and have this shape:

```json
{
  "id": 1,
  "title": "Study TypeScript",
  "done": false
}
```

## `GET /health`

Returns a simple health check.

### Success Response

Status: `200 OK`

```json
{
  "status": "ok"
}
```

## `GET /tasks`

Returns all tasks currently stored in memory.

### Success Response

Status: `200 OK`

```json
[
  { "id": 1, "title": "Study TypeScript", "done": false },
  { "id": 2, "title": "Build first API", "done": false }
]
```

## `GET /tasks/:id`

Returns a task by numeric ID.

### Success Response

Status: `200 OK`

```json
{ "id": 1, "title": "Study TypeScript", "done": false }
```

### Error Response

Status: `404 Not Found`

```json
{
  "message": "Task not found"
}
```

## `POST /tasks`

Creates a new task.

### Request Body

```json
{
  "title": "Learn Express"
}
```

Rules:

- `title` is required
- `title` must be a string
- empty bodies return `400 Bad Request`

### Success Response

Status: `201 Created`

```json
{
  "id": 3,
  "title": "Learn Express",
  "done": false
}
```

### Error Response

Status: `400 Bad Request`

```json
{
  "message": "Invalid title"
}
```

## `PATCH /tasks/:id/done`

Marks a task as done.

### Success Response

Status: `200 OK`

```json
{
  "id": 2,
  "title": "Build first API",
  "done": true
}
```

### Error Response

Status: `404 Not Found`

```json
{
  "message": "Task not found"
}
```

## `DELETE /tasks/:id`

Deletes a task from memory.

### Success Response

Status: `200 OK`

```json
{
  "message": "Task deleted"
}
```

### Error Response

Status: `404 Not Found`

```json
{
  "message": "Task not found"
}
```
