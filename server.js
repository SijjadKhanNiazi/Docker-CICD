import express from "express";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("hello world");
  res.json({
    message: "Hello from docker",
  });
});

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
