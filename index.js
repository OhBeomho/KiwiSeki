const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const express = require("express");
const indexRouter = require("./routers/indexRouter");
const userRouter = require("./routers/userRouter");
const wikiRouter = require("./routers/wikiRouter");
const reqeustRouter = require("./routers/requestRouter");
const app = express();

const session = require("express-session");
const MemoryStore = require("memorystore")(session);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

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
app.use((req, res, next) => {
  res.locals.loggedUser = req.session.user;
  next();
});

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/wiki", wikiRouter);
app.use("/request", reqeustRouter);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kiwisekwi.fi7kd3b.mongodb.net/?retryWrites=true&w=majority`,
    {
      dbName: process.env.NODE_ENV,
      appName: "kiwiseki"
    }
  )
  .then(() => app.listen(Number(process.env.PORT), () => console.log("localhost:" + process.env.PORT)));
