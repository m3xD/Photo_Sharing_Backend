const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
});

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);
