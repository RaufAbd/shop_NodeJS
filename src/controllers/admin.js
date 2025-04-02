const Product = require("../models/product");

exports.allProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      pageTitle: "All products",
      products,
      url: "/admin",
    });
  });
};

exports.addProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add product",
    url: "/add-product",
  });
};
exports.editProduct = (req, res, next) => {
  const id = req.params.id;
  Product.fetchAll((products) => {
    const product = products.find((product) => id === product.id);

    if (!product) {
      return next();
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      product,
      url: "/edit-product/:" + id,
    });
  });
};

exports.saveProduct = (req, res, next) => {
  const { title, description, image, price } = req.body;
  const product = new Product(title, description, image, price);
  product.save();

  res.redirect("/");
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.delete(id);

  res.redirect("/");
};
