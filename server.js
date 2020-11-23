const express = require("express");
const app = express();

const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

//get random quotes
app.get("/api/quotes/random", (req, res) => {
  const quote = getRandomElement(quotes);
  res.send({
    quote,
  });
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
app.get("/quoteId/:id", (req, res) => {
  const editedQuote = req.query.quote;
  const editedAuthor = req.query.author;
  const quoteId = Number(req.params.id);
  const quoteIdx = quotes.findIndex((quote) => quote.id === quoteId);
  quotes[quoteIdx].quote = editedQuote;
  quotes[quoteIdx].person = editedAuthor;
  res.redirect("/");
});
//delete quotes
app.get("/delete/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  const quoteIdx = quotes.findIndex((quote) => quote.id === quoteId);
  quotes.splice(quoteIdx, 1);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("server started on port 4001");
});
