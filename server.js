const express = require("express");
const app = express();

const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

//get random quotes
app.get("/api/quotes/random", (req, res) => {
  if (quotes.length > 0) {
    const quote = getRandomElement(quotes);
    res.send({
      quote,
    });
  }
});
//get all quotes if no author defined or else fetch by author
app.get("/api/quotes", (req, res) => {
  if (!req.query.hasOwnProperty("person")) {
    res.send({ quotes });
  }
  if (req.query.hasOwnProperty("person")) {
    let person = req.query.person;
    const filteredQuotes = quotes.filter((quote) => quote.person === person);
    res.send({ quotes: filteredQuotes });
  }
});

//post new quotes
app.post("/api/quotes", (req, res) => {
  const person = req.query.person;
  const quote = req.query.quote;
  const query = req.query;
  const id = quotes.length;
  if (person && quote) {
    quotes.push({ id, quote, person });
    res.send({
      quote: { id, quote, person },
    });
  } else {
    res.sendStatus(400);
  }
});
//edit quotes
app.put("/api/quotes/:id", (req, res) => {
  const editedQuote = req.query.quote;
  const editedPerson = req.query.person;
  const quoteId = Number(req.params.id);
  const quoteIdx = quotes.findIndex((quote) => quote.id === quoteId);
  if (editedQuote && editedPerson) {
    quotes[quoteIdx].quote = editedQuote;
    quotes[quoteIdx].person = editedPerson;
    res.send({
      quote: { editedQuote, editedPerson },
    });
  }
});

//delete quotes
app.delete("/api/quotes/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  const quoteIdx = quotes.findIndex((quote) => quote.id === quoteId);
  if (quoteIdx !== -1) {
    quotes.splice(quoteIdx, 1);
    res.status(200).send("quote deleted correctly");
  } else {
    res.status(404).send("Quote not found");
  }
});

app.listen(PORT, () => {
  console.log("server started on port 4001");
});
