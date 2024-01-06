const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const express = require("express");
const app = express();

const session = require("express-session");
const MemoryStore = require("memorystore")(session);

const config = require("./config");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

const maxAge = 60 * 60 * 1000;
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: maxAge }),
    cookie: { maxAge }
  })
);

mongoose
  .connect(
    `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@kiwisekwi.fi7kd3b.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => app.listen(Number(config.PORT), () => console.log("localhost:" + config.PORT)));
