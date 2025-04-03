const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "All products",
      products,
      url: "/products",
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id, (product) => {
    res.render("shop/product-details", {
      pageTitle: "Product details",
      product,
      url: "",
    });
  });
};

exports.getCartItems = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    products: [1, 2, 3],
    url: "/cart",
  });
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    products: [1, 2, 3],
    url: "/cart",
  });
};
