const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorController = require("./controllers/error");

const User = require("./models/user");

const MongoConnect = require("./utils/database").mongoConnect;

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findById("6847234fe4c8c262266f204b")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use(shopRoutes);
app.use(adminRoutes);

app.use(errorController.notFound);

MongoConnect(() => {
  app.listen(3000);
});
