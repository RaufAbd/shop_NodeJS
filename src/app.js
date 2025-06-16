const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorController = require("./controllers/error");

const User = require("./models/user");

const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findById("684f08524c09cee5d08d7fec")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(shopRoutes);
app.use(adminRoutes);

app.use(errorController.notFound);

mongoose
  .connect(
    "mongodb+srv://araxisr4:pJrEkkZA2XHp4Rg4@cluster0.ueue7w1.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Rauf",
          email: "test@test.com",
          items: [],
        });

        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => console.log(err));
