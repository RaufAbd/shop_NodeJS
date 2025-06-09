const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render("shop/product-list", {
      pageTitle: "All products",
      products,
      url: "/products",
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id).then((product) => {
    res.render("shop/product-details", {
      pageTitle: "Product details",
      product,
      url: "/products",
    });
  });
};

exports.getCartItems = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        cart: products,
        url: "/cart",
      });
    })
    .catch((err) => console.log(err));
};

exports.addToCart = (req, res, next) => {
  const itemId = req.body.itemId;

  Product.findById(itemId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.deleteFromCart = (req, res, next) => {
  const itemId = req.body.itemId;

  req.user
    .deleteFromCart(itemId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.removeFromCart = (req, res, next) => {
  const itemId = req.body.itemId;

  req.user
    .removeFromCart(itemId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.checkout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Your Orders",
    userInfo: req.user,
    url: "/cart/checkout",
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        orders,
        url: "/orders",
      });
    })
    .catch((err) => console.log(err));
};
