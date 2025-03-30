const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    pageTitle: "All products",
    products: Product.products,
    url: "/",
  });
};
exports.getProductDetails = (req, res, next) => {
  const id = req.params.id;
  const product = Product.getProduct(id);

  if (!product) {
    return next();
  }
  res.render("product", {
    pageTitle: "Product details",
    product,
    url: "/product/:" + id,
  });
};

exports.getCartItems = (req, res, next) => {
  res.render("cart", {
    pageTitle: "Cart",
    products: [1, 2, 3],
    url: "/cart",
  });
};
