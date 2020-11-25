const express = require("express");
const app = express();
const quoteRouter = require("./quoteRouter");
const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("server started on port 4001");
});

app.use("/api/quotes", quoteRouter);
