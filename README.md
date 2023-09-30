# Task Planner Express.js API

This is a simple Express.js API for managing tasks. It allows you to perform basic CRUD operations on tasks and retrieve task metrics.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm (Node Package Manager) installed on your machine.
- SQLite3 installed on your machine.
- Git for cloning the repository (optional).

## Setup

Follow these steps to set up and run the project:

1. Clone this repository (if you haven't already) or download the project files:

   ```bash
   git clone https://github.com/prathameshh27
   ```

2. Navigate to the project directory:

   ```bash
   cd TaskPlanner
   ```

3. Install project dependencies (Not required):

   ```bash
   npm install
   ```

4. Start the Express.js server:

   ```bash
   npm start
   ```

   The server will start on port 8080 by default. You can specify a different port by setting the `PORT` environment variable.

## API Endpoints

- **Root Endpoint**: `/`
  - HTTP Method: GET
  - Description: Welcome message.

- **Add a Task Endpoint**: `/api/v1/task`
  - HTTP Method: POST
  - Description: Add a new task.
  - Request Body:
    ```json
    {
      "title": "Task Title",
      "description": "Task Description"
    }
    ```
  - Response (Success):
    - HTTP Status: 201 Created
    - Body:
      ```json
      {
        "task_id": 1,
        "status": "OPEN",
        "message": "Task created successfully"
      }
      ```
  - Response (Error):
    - HTTP Status: 500 Internal Server Error
    - Body:
      ```json
      {
        "error": "Something went wrong",
        "payload_example": {
          "title": "Test Task",
          "description": "Test Description"
        }
      }
      ```

- **Get Tasks Endpoint**: `/api/v1/task`
  - HTTP Method: GET
  - Description: Get a paginated list of tasks.
  - Query Parameters:
    - `page` (optional): Page number (default is 1).
  - Response (Success):
    - HTTP Status: 200 OK
    - Body: Array of task objects.
  - Response (Error):
    - HTTP Status: 500 Internal Server Error
    - Body:
      ```json
      {
        "error": "Something went wrong"
      }
      ```

- **Update Task Endpoint**: `/api/v1/task/:id`
  - HTTP Method: PATCH
  - Description: Update an existing task.
  - URL Parameter:
    - `id`: The ID of the task to update.
  - Request Body (any combination of fields):
    ```json
    {
      "title": "New Task Title",
      "description": "New Task Description",
      "status": "INPROGRESS" // OPEN | INPROGRESS | CLOSED
    }
    ```
  - Response (Success):
    - HTTP Status: 200 OK
    - Body:
      ```json
      {
        "task_id": 1,
        "status": "INPROGRESS",
        "message": "Task updated successfully"
      }
      ```
  - Response (Error):
    - HTTP Status: 500 Internal Server Error
    - Body:
      ```json
      {
        "error": "Something went wrong",
        "payload_example": {
          "title": "Test Task",
          "description": "Test Description",
          "status": "OPEN | INPROGRESS | CLOSED"
        }
      }
      ```

- **Get Task Metrics Endpoint**: `/api/v1/task_metrics`
  - HTTP Method: GET
  - Description: Get task metrics (e.g., total tasks, open tasks, in-progress tasks, completed tasks).
  - Response (Success):
    - HTTP Status: 200 OK
    - Body:
      ```json
      {
        "total_tasks": 10,
        "open_tasks": 5,
        "inprogress_tasks": 3,
        "completed_tasks": 2
      }
      ```
  - Response (Error):
    - HTTP Status: 500 Internal Server Error
    - Body:
      ```json
      {
        "error": "Internal Server Error",
        "message": "<error-message>"
      }
      ```

## Database Initialization

The SQLite database is automatically initialized when the server starts. It creates a table named `tasks` to store task data.

## Important Notes

- The server uses SQLite as the database by default. You can modify the database configuration in the code if needed.
- Ensure that you have the required dependencies installed, and the server is running before making API requests.
- For the `PATCH` endpoint, you can update one or more fields of a task.
- Task statuses should be one of the following: `OPEN`, `INPROGRESS`, or `CLOSED`.
