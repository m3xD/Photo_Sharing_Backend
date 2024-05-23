const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const auth = require('../middleware/middle')

router.use(bodyParser.json());

router.get("/find/:id", auth, async (request, response) => {
  try {
    const users = await User.findOne({ _id: request.params.id });
    response.send(users);
  } catch (error) {
    response.status(400).send({ error });
  }
});

router.get("/list", auth, async (request, response) => {
  try {
    const users = await User.find({});
    response.send(users);
  } catch (error) {
    response.status(400).send({ error });
  }
});

router.post("/signup", async (request, response) => {
  const data = request.body;
  const user = new User(data);
  try {
    await user.save();
    response.status(200).send("Login successfully");
  } catch (error) {
    console.log(error);
    response.status(400).send({ error });
  }
});

router.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;
    const user = await User.findOne({ username: username });
    let res = await bcrypt.compare(password, user.password);
    if (res && user) {
      const token = jwt.sign(
        { username: username },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        },
      );
      response.status(200).json({
        token: token,
        id: user._id,
      });
    } else {
      response.status(401).send("Wrong password or username not exist");
    }
  } catch (error) {
    console.log(error);
    response.status(400).send({ error });
  }
});

module.exports = router;
