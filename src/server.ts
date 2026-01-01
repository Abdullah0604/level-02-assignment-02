import express from "express";

const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "server is working",
  });
});

app.listen(port, () => {
  console.log("server is running on port ", port);
});
