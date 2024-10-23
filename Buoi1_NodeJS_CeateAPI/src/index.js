const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");

app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/post/:id", (req, res) => {
  res.json({
    id: req.params.id,
    name: "minh",
  });
});

app.get("/users", (req, res) => {
  res.json([
    {
      id: 1,
      name: "phong",
    },
    {
      id: 2,
      name: "minh",
    },
  ]);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
