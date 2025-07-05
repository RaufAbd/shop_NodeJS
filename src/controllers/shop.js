const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find().then((products) => {
    res.render("shop/product-list", {
      pageTitle: "All products",
      products,
      url: "/products",
      isAuthenticated: req.session.isLoggedIn,
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
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.getCartItems = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map(({ productId, quantity }) => ({
        ...productId._doc,
        quantity,
      }));

      res.render("shop/cart", {
        pageTitle: "Your Cart",
        cart: products,
        url: "/cart",
        isAuthenticated: req.session.isLoggedIn,
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
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map(({ productId, quantity }) => {
        return { product: { ...productId._doc }, quantity };
      });

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });

      return order.save();
    })
    .then(() => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        orders,
        url: "/orders",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
