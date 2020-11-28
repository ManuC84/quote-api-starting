const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  person: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Quote", UserSchema);
