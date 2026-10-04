const express = require("express");
const mongoose = require("mongoose");
const { createClient } = require("redis");

const app = express();

app.use(express.json());

const PORT = 5000;

const mongoUrl = process.env.MONGODB_URL;
const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

async function startServer() {
  try {
    await mongoose.connect(mongoUrl);

    console.log("MongoDB connected successfully");

    await redisClient.connect();

    console.log("Redis connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "Docker API is working",
  });
});
app.get("/instance", (req, res) => {
  res.json({
    instance: process.env.INSTANCE_NAME || "unknown",
  });
});
app.get("/cache", async (req, res) => {
  await redisClient.set("message", "Hello from redis cache!");

  const value = await redisClient.get("message");

  res.json({
    value,
  });
});

startServer();
