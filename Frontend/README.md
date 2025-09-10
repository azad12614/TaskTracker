# TaskTracker

**Track Your Life’s Tasks – Built with MERN Stack**
A dynamic, full-stack task management app designed to help users organize and monitor their to-dos—built solo by Abdullah Al Azad and deployed via Render.

[Live Demo](https://tasktracker12614.onrender.com/) • [GitHub Repo](https://github.com/azad12614/TaskTracker)

---

## Overview

TaskTracker is a modern task management tool tailored for ultimate productivity—easy task creation, editing, and tracking in one clean, intuitive interface.

---

## Features

- **Add / Edit / Delete Tasks** – Streamline your task list with real-time updates.
- **Task Status Management** – Mark tasks as completed or pending to stay organized.
- **User-Friendly UI** – Simple and responsive design for distraction-free task tracking.
- **Solo Full-Stack App** – Built end-to-end with MERN technologies and deployed using Render.

---

## Tech Stack

| Frontend        | Backend                | Hosting |
| --------------- | ---------------------- | ------- |
| React.js (Vite) | Node.js + Express.js   | Render  |
| CSS (vanilla)   | RESTful API            |         |
| JavaScript      | MongoDB (Mongoose ORM) |         |

---

## Project Structure

```
/frontend – React app with task UI
/backend  – Express server, MongoDB models, RESTful routes
```

- Frontend communicates with backend via Axios and renders tasks in real-time.
- Backend stores task data, offering CRUD endpoints and database persistence.

---

## Why It Matters

- **Solves Real Problems:** Creates an organized way to track personal and professional tasks.
- **Showcases Full-Stack Mastery:** Demonstrates you can independently architect, develop, and deploy an end-to-end application.
- **Cleanly Executed:** Prioritizes simplicity, responsiveness, and reliability.

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm
- MongoDB (local or cloud instance)

### Running Locally

#### Backend

```bash
cd backend
npm install
# Ensure .env includes your DB connection:
#   MONGO_URI=your_mongo_connection_string
npm run dev   # Starts server on default port (e.g., 5000)
```

#### Frontend

```bash
cd frontend
npm install
npm start     # Starts React dev server (e.g., http://localhost:3000)
```

The frontend communicates with the backend API—start backend first to enable task functionality.

---

## Tech Keywords for ATS & Developers

- **Frontend:** React.js, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js, REST APIs
- **Database & ORM:** MongoDB, Mongoose
- **DevOps:** Render (deployment)
- **Core Concepts:** CRUD operations, Full-Stack Development

---

## What’s Next?

Consider adding:

- **User Auth & Profiles** (JWT, OAuth)
- **Drag-and-Drop UI** for task reordering
- **Filtering & Search** to navigate large task lists
- **Due Dates & Notifications** for reminders
- **Testing Suite** (Jest, Cypress) for robust validation

---

## Credits & Contact

**Built with ❤️ by Abdullah Al Azad**
Solo full-stack developer showcasing practical MERN capabilities. Use the app, explore the code, and feel free to connect!

---
