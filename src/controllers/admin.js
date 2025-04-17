const Product = require("../models/product");

exports.allProducts = (req, res, next) => {
  Product.fetchAll((products) => {
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
  Product.findById(id, (product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      product,
      url: "/admin/products",
    });
  });
};

exports.saveProduct = (req, res, next) => {
  const { id, title, description, image, price } = req.body;
  const product = new Product(title, description, image, price, id);
  product.save();

  res.redirect("/admin/products");
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.delete(id);

  res.redirect("/admin/products");
};
