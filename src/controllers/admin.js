const Product = require("../models/product");

exports.allProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render("admin/products", {
      pageTitle: "Admin products",
      products,
      url: "/admin/products",
    });
  });
};

exports.addProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add product",
    url: "/admin/products/add",
  });
};

exports.editProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id).then((product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      product: product,
      url: "/admin/products",
    });
  });
};

exports.saveProduct = (req, res, next) => {
  const { id, title, description, image, price } = req.body;
  const product = new Product(
    title,
    description,
    image,
    price,
    id,
    req.user._id
  );

  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log("product creating error", err));
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.deleteById(id)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log("Error while deleting product", err));
};
