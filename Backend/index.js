require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("TaskTrackerDB");
    const tasksCollection = database.collection("tasks");

    app.get("/api/tasks", async (req, res) => {
      const userEmail = req.query.email;

      if (!userEmail) {
        return res
          .status(400)
          .json({ message: "User email is required for fetching tasks" });
      }

      try {
        const tasks = await tasksCollection
          .find({ userEmail: userEmail })
          .toArray();
        res.status(200).json(tasks);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to fetch tasks", error: error.message });
      }
    });

    app.get("/api/tasks/:id", async (req, res) => {
      const { id } = req.params;

      try {
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid Task ID format" });
        }
        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });
        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to fetch task", error: error.message });
      }
    });

    app.post("/api/tasks", async (req, res) => {
      const { title, description, dueDate, status, priority, userEmail } =
        req.body;

      if (!title || !userEmail) {
        return res
          .status(400)
          .json({ message: "Task title and user email are required" });
      }

      const newTask = {
        title,
        description: description || "",
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || "Pending",
        priority: priority || "Medium",
        userEmail: userEmail,
        createdAt: new Date(),
      };

      try {
        const result = await tasksCollection.insertOne(newTask);

        res.status(201).json({ _id: result.insertedId, ...newTask });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to add task", error: error.message });
      }
    });

    app.put("/api/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const { userEmail, ...updates } = req.body;

      if (!ObjectId.isValid(id) || !userEmail) {
        return res
          .status(400)
          .json({ message: "Invalid Task ID format or missing user email" });
      }

      if (updates.dueDate) {
        updates.dueDate = new Date(updates.dueDate);
      }

      try {
        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(id), userEmail: userEmail },
          { $set: updates }
        );

        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ message: "Task not found or not owned by user" });
        }

        const updatedTask = await tasksCollection.findOne({
          _id: new ObjectId(id),
        });
        res.status(200).json(updatedTask);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to update task", error: error.message });
      }
    });

    app.delete("/api/tasks/:id", async (req, res) => {
      const { id } = req.params;

      const userEmail = req.query.email;

      if (!ObjectId.isValid(id) || !userEmail) {
        return res
          .status(400)
          .json({ message: "Invalid Task ID format or missing user email" });
      }

      try {
        const result = await tasksCollection.deleteOne({
          _id: new ObjectId(id),
          userEmail: userEmail,
        });
        if (result.deletedCount === 0) {
          return res
            .status(404)
            .json({ message: "Task not found or not owned by user" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to delete task", error: error.message });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB or start server:", error);
    process.exit(1);
  }
}

run().catch(console.dir);

app.use(express.static(path.join(__dirname, "../../Frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

app.listen(port, () => {
  console.log(
    `TaskTracker backend listening at http://localhost:${port} or https://tasktracker-backend-ysn0.onrender.com`
  );
});
