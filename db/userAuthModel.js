const mongoose = require("mongoose");

const UserAuthSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
});

const UserAuth = mongoose.model("UserAuth", UserAuthSchema);

module.exports = UserAuth;
