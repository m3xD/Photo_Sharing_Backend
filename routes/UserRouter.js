const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const auth = require('../middleware/middle')
const e = require("express");

router.use(bodyParser.json());

router.get("/find/:id", auth, async (request, response) => {
    try {
        const users = await User.findOne({_id: request.params.id});
        response.send(users);
    } catch (error) {
        response.status(400).send({error});
    }
});

router.get("/list", auth, async (request, response) => {
    try {
        const users = await User.find({});
        response.send(users);
    } catch (error) {
        response.status(400).send({error});
    }
});

router.post("/signup", async (request, response) => {
    const data = request.body;
    const user = new User(data);
    try {
        const tmp = await User.findOne({username: data.username});
        if (tmp) {
            throw new Error('Username already exists');
        } else {
            await user.save();
            response.status(200).send("Login successfully");
        }
    } catch (error) {
        console.log(error.message);
        response.status(400).send(error.message);
    }
});

router.post("/login", async (request, response) => {
    try {
        const {username, password} = request.body;
        const user = await User.findOne({username: username});
        if (!user) {
            throw new Error('User name not exist')
        } else {
            let res = await bcrypt.compare(password, user.password);
            if (!res) {
                throw new Error('Wrong password');
            } else {
                const token = jwt.sign(
                    {username: username},
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: "1h",
                    },
                );
                response.status(200).json({
                    token: token,
                    id: user._id,
                });
            }
        }
    } catch (error) {
        response.status(400).send(error.message);
    }
});

module.exports = router;
