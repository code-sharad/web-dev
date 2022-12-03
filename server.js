const express = require("express");
const mongoose = require("mongoose");
const dontenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(require("./router/auth"));

dontenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;
const PORT = process.env.PORT;

const user = require("./models/userSchem");

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connection successful`);
  })
  .catch((err) => {
    console.log(`no connection`);
  });

const middleware = (req, res, next) => {
  console.log("this is middleware");
  next();
};

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
