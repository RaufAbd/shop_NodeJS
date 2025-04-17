const Product = require("../models/product");
const Cart = require("../models/cart");

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
      url: "/products",
    });
  });
};

exports.getCartItems = (req, res, next) => {
  Cart.fetchAll((cart) => {
    res.render("shop/cart", {
      pageTitle: "Your Cart",
      cart,
      url: "/cart",
    });
  });
};

exports.addToCart = (req, res, next) => {
  const itemId = req.body.itemId;
  Product.findById(itemId, (product) => {
    Cart.add(product);
    res.redirect("/cart");
  });
};

exports.deleteFromCart = (req, res, next) => {
  const itemId = req.body.itemId;
  Cart.delete(itemId);
  res.redirect("/cart");
};

exports.removeFromCart = (req, res, next) => {
  const id = req.body.itemId;
  Cart.remove(id);

  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    products: [1, 2, 3],
    url: "/cart",
  });
};
