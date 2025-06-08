const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorController = require("./controllers/error");

const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(shopRoutes);
app.use(adminRoutes);

app.use(errorController.notFound);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync({ force: true })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("sequelize sync error", err);
  });
