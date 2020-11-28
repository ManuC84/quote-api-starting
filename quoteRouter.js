const express = require("express");
const app = express();
const quoteRouter = express.Router();
const { quotes } = require("./data");
const { getRandomElement } = require("./utils");
const moongoose = require("mongoose");
const Db = require("./schema");
const dbData = require("./dbData");

//get random quotes
quoteRouter.get("/random", (req, res) => {
  if (quotes.length > 0) {
    const quote = getRandomElement(quotes);
    res.send({
      quote,
    });
  }
});
//get all quotes if no author defined or else fetch by author
quoteRouter.get("/", (req, res) => {
  if (!req.query.hasOwnProperty("person")) {
    const mongoData = Db.collection("quotes").find({});
    res.send({ mongoData });
  }
  if (req.query.hasOwnProperty("person")) {
    let person = req.query.person;
    const filteredQuotes = quotes.filter((quote) => quote.person === person);
    res.send({ quotes: filteredQuotes });
  }
});

//post new quotes
quoteRouter.post("/", (req, res) => {
  const person = req.query.person;
  const quote = req.query.quote;
  const query = req.query;
  const id = quotes.length;
  if (person && quote) {
    quotes.push({ id, quote, person });
    res.send({
      quote: { id, quote, person },
    });
    Db.create({ id, quote, person });
  } else {
    res.sendStatus(400);
  }
});

//edit quotes
quoteRouter.put("/:id", (req, res) => {
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
quoteRouter.delete("/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  const quoteIdx = quotes.findIndex((quote) => quote.id === quoteId);
  if (quoteIdx !== -1) {
    quotes.splice(quoteIdx, 1);
    res.status(200).send("quote deleted correctly");
  } else {
    res.status(404).send("Quote not found");
  }
});

module.exports = quoteRouter;
