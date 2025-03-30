const Product = require("../models/product");

exports.newProduct = (req, res, next) => {
  res.render("admin", { pageTitle: "Add product", url: "/new-product" });
};

exports.addProduct = (req, res, next) => {
  const { title, description, image, price } = req.body;
  const id = Math.random().toString(36).substring(2);
  const product = new Product(title, description, image, price, id);
  product.save();

  res.redirect("/");
  // res.render("admin", { pageTitle: "Add product", url: "/add-product" });
};
