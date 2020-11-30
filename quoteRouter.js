const express = require("express");
const app = express();
const quoteRouter = express.Router();
const { quotes } = require("./data");
const { getRandomElement } = require("./utils");
const moongoose = require("mongoose");
const Db = require("./schema");

//get random quotes
quoteRouter.get("/random", (req, res) => {
  Db.find((err, data) => {
    if (data.length > 0) {
      const quote = getRandomElement(data);
      res.send({ quote });
    }
  });
});
//get all quotes if no author defined or else fetch by author
quoteRouter.get("/", (req, res) => {
  if (!req.query.hasOwnProperty("person")) {
    Db.find((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
  }
  if (req.query.hasOwnProperty("person")) {
    Db.find((err, data) => {
      let person = req.query.person;
      const filteredQuotes = data.filter((quote) => quote.person === person);
      res.send({ quotes: filteredQuotes });
    });
  }
});

//post new quotes
quoteRouter.post("/", (req, res) => {
  const person = req.query.person;
  const quote = req.query.quote;
  const query = req.query;
  // const id = quotes.length;

  if (person && quote) {
    Db.find((err, data) => {
      if (err) {
        console.log(err);
      } else {
        const id = data.length;
        res.send({
          quote: { id, quote, person },
        });
        Db.create({ id, quote, person });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

//edit quotes
quoteRouter.put("/:id", (req, res) => {
  const editedQuote = req.query.quote;
  const editedPerson = req.query.person;
  const quoteId = Number(req.params.id);
  const updateId = { id: quoteId };
  const updateQuotes = { quote: editedQuote, person: editedPerson };
  if (editedQuote && editedPerson) {
    try {
      Db.updateOne(updateId, updateQuotes, function (err, res) {
        if (err) throw err;
      });
      res.send({
        quote: { editedQuote, editedPerson },
      });
    } catch (error) {
      console.log(error);
    }
  }
});

//delete quotes
quoteRouter.delete("/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  const deleteId = { id: quoteId };
  try {
    Db.deleteOne(deleteId, (err, res) => {
      if (err) throw err;
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = quoteRouter;
