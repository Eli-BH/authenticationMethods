const mongoose = require("mongoose");
const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("User", user);
