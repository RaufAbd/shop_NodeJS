const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");

const User = require("./models/user");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const MONGODB_URI =
  "mongodb+srv://araxisr4:pJrEkkZA2XHp4Rg4@cluster0.ueue7w1.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(shopRoutes);
app.use(adminRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.notFound);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    url: "/500",
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
