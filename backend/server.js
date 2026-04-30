const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/predict", (req, res) => {
  const inputData = req.body.data;

  const python = spawn("python", ["predict.py", JSON.stringify(inputData)]);

  let output = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  python.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Prediction failed" });
    }
    const lines = output.trim().split("\n");
    const result = lines[lines.length - 1].trim();
    res.json({ result });
  });
});

app.listen(5001, () => console.log("Server running on port 5001"));
