require("dotenv").config();

const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const express = require("express");
const app = express();

const session = require("express-session");
const MemoryStore = require("memorystore")(session);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session settings
const maxAge = 60 * 60 * 1000;
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: maxAge }),
    cookie: { maxAge }
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kiwisekwi.fi7kd3b.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => app.listen(Number(process.env.PORT), () => console.log("localhost:" + process.env.PORT)));
