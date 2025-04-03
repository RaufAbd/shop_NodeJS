const Product = require("../models/product");

exports.allProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    console.log("asd", products);
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
  Product.fetchAll((products) => {
    const product = products.find((product) => id === product.id);

    if (!product) {
      return next();
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      product,
      url: "/admin/products/edit/:" + id,
    });
  });
};

exports.saveProduct = (req, res, next) => {
  const { title, description, image, price } = req.body;
  const product = new Product(title, description, image, price);
  product.save();

  res.redirect("/products");
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.delete(id);

  res.redirect("/products");
};
