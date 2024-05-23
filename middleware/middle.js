const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../db/userModel");

module.exports = async (request, response, next) => {
  const author = request.headers["authorization"];
  const token = author && author.split(" ")[1];
  if (!token) response.sendStatus(401);
  else {
    try {
      const { username, exp } = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      );
      const user = await User.findOne({ username: username });
      request.user = { ...user, token: token, expired: new Date(exp * 10) };
      next();
    } catch (error) {
      response.sendStatus(400).send("Unauthorized");
    }
  }
}
