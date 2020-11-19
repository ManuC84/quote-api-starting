const express = require("express");
const app = express();

const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

app.get("/api/quotes/random", (req, res) => {
  const quote = getRandomElement(quotes);
  res.send({
    quote,
  });
});

app.get("/api/quotes", (req, res) => {
  if (!req.query.hasOwnProperty("person")) {
    res.send({ quotes });
  }
  if (req.query.hasOwnProperty("person")) {
    let person = req.query.person;
    const filteredQuotes = quotes.filter((quote) => quote.person === person);
    res.send({ quotes: filteredQuotes });
  } else {
    res.send([]);
  }
});

app.post("/api/quotes", (req, res) => {
  const person = req.query.person;
  const quote = req.query.quote;
  const query = req.query;
  if (person && quote) {
    quotes.push({ quote, person });
    res.send({
      quote: { quote, person },
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log("server started on port 4001");
});
