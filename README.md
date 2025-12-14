# 🚀 TaskTracker: A Full-Stack MERN Task Management Application

A secure, high-performance task management solution built on the MERN stack (MongoDB, Express, React, Node.js). TaskTracker provides users with full CRUD capabilities, time-aware validation, and advanced sorting options to effectively manage their personal and professional workflows.

[Live Demo](https://tasktracker12614.onrender.com/) • [GitHub Repo](https://github.com/azad12614/TaskTracker)

---

## ✨ Core Features

### Task Management (CRUD)

- **Creation & Editing:** Seamlessly add and update tasks with fields for detailed tracking.
- **Comprehensive Task Schema:** Tasks are defined by seven distinct properties: `title`, `description`, `dueDate`, `time`, `status`, `priority`, and `severity`.
- **Deletion:** Securely remove tasks, scoped only to the authenticated user.

### Security and Authentication

- **JWT-Based Authentication:** User sessions are secured using JSON Web Tokens (JWT).
- **HttpOnly Cookies:** The authentication token is stored in an HttpOnly cookie, preventing client-side JavaScript access and mitigating XSS attacks.
- **Session Management:** The token expires after **1 day** (`maxAge: 24 * 60 * 60 * 1000`).
- **Strong Password Policy:** Registration enforces a minimum of 6 characters, and includes checks for at least one uppercase letter, one lowercase letter, one number, and one special character.

### Advanced Functionality

- **Time-Aware Validation:** Server-side validation ensures `dueDate` and `time` are in the correct formats (`YYYY-MM-DD` and `HH:MM`) and, critically, ensures tasks cannot be created or edited for a time that has already passed ("Please try to forget the Past!").
- **Dynamic Sorting:** Tasks can be sorted by four primary fields (`priority`, `severity`, `status`, `dueDate`). The sorting logic includes intelligent tie-breaking to maintain consistent organization.

---

## 🛠️ Tech Stack

| Component      | Technology         | Dependencies (Key)                           |
| :------------- | :----------------- | :------------------------------------------- |
| **Frontend**   | React (Vite)       | `axios`, `react-router-dom`, `jwt-decode`    |
| **Backend**    | Node.js / Express  | `express`, `dotenv`, `cors`, `cookie-parser` |
| **Database**   | MongoDB / Mongoose | `mongoose`, `bcrypt`, `jsonwebtoken`         |
| **Deployment** | Render             | N/A                                          |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v24+)
- npm (v11+)
- MongoDB Atlas

### 1. Backend Setup (`/backend`)

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Configure Environment:** Create a `.env` file in the root of the backend directory:
    ```env
    PORT=5000
    MONGO_URI="YOUR_MONGODB_CONNECTION_STRING"
    JWT_SECRET="YOUR_LONG_RANDOM_SECRET"
    VITE_CLIENT_BASE_URL="YOUR_FORNTEND_URL"
    ```
3.  **Run the Server:**
    ```bash
    npm run dev  # or node index.js
    ```
    The API server will run on `http://localhost:5000`.

### 2. Frontend Setup (`/frontend`)

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Configure Environment:** Create a `.env` file in the root of the frontend directory.
    ```env
    VITE_API_BASE_URL="YOUR_BACKEND_URL"
    # Change to your live Render URL for production.
    ```
3.  **Run the Client:**
    ```bash
    npm run dev
    ```
    The React application will typically run on `http://localhost:5173`.

---

## 🔗 API Endpoints

All Task API endpoints require an authenticated user with a valid `jwt_token` cookie.

| Endpoint                    | Method   | Description                                   |
| :-------------------------- | :------- | :-------------------------------------------- |
| `/api/admin/register`       | `POST`   | Registers a new user.                         |
| `/api/admin/login`          | `POST`   | Authenticates user and sets HttpOnly cookie.  |
| `/api/admin/logout`         | `POST`   | Clears the HttpOnly cookie.                   |
| `/api/task/add-task`        | `POST`   | Creates a new task.                           |
| `/api/task/all-tasks`       | `GET`    | Fetches all tasks for the authenticated user. |
| `/api/task/edit-task/:id`   | `PUT`    | Updates an existing task by ID.               |
| `/api/task/delete-task/:id` | `DELETE` | Deletes a task by ID.                         |

---

## What’s Next?

Consider adding:

- **Drag-and-Drop UI** for task reordering
- **Filtering & Search** to navigate large task lists
- **Due Dates & Notifications** for reminders
- **Testing Suite** (Jest, Cypress) for robust validation

---

## Credits & Contact

**Built with ❤️ by Abdullah Al Azad**
Solo full-stack developer showcasing practical MERN capabilities. Use the app, explore the code, and feel free to connect!

---
