const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "All products",
      products,
      url: "/",
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.id;
  Product.fetchAll((products) => {
    const product = products.find((product) => id === product.id);

    if (!product) {
      return next();
    }

    res.render("shop/product-details", {
      pageTitle: "Product details",
      product,
      url: "/product/:" + id,
    });
  });
};

exports.getCartItems = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    products: [1, 2, 3],
    url: "/cart",
  });
};
