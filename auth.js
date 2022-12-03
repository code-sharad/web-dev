const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");

require("../server");
const User = require("../models/userSchem");

const middleware = (req, res, next) => {
  console.log("this is middleware");
  next();
};

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/about", middleware, (req, res) => {
  res.send("this is middleware router with about");
});

router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(422).json({ error: "pls fill the field proporely" });
  }

  try {
    const userExit = await User.findOne({ email: email });
    if (userExit) {
      return res.status(200).json({ error: "email already exits" });
    }
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: password,
    });
    await user.save();
    res.status(201).json({ message: "succesfully " });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send.status(422).json({ error: "pls filled field." });
    }
    const userLogin = await User.findOne({ email: email });

    console.log(userLogin);
    
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      if (!isMatch) {
        res.status(400).json({ error: "Invaild credientials" });
      } else {
        res.json({ message: "login succesfully email" });
      }
    }
    else {
      res.status(400).json({ error: "Invaild credientials" });
    }

  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
