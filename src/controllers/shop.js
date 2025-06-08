const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render("shop/product-list", {
      pageTitle: "All products",
      products,
      url: "/products",
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.id;
  Product.findAll({ where: { id } }).then(([product]) => {
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
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            pageTitle: "Your Cart",
            cart: products,
            url: "/cart",
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  // Cart.fetchAll((cart) => {
  //   res.render("shop/cart", {
  //     pageTitle: "Your Cart",
  //     cart,
  //     url: "/cart",
  //   });
  // });
};

exports.addToCart = (req, res, next) => {
  const itemId = req.body.itemId;
  let newQuantity = 1;
  let fetchedCart;
  let product;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: itemId } });
    })
    .then((products) => {
      if (products.length) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      return Product.findByPk(itemId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.deleteFromCart = (req, res, next) => {
  const itemId = req.body.itemId;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: itemId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // Cart.delete(itemId);
};

exports.removeFromCart = (req, res, next) => {
  const itemId = req.body.itemId;
  let newQuantity;
  let fetchedCart;
  let fetchedProduct;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: itemId } });
    })
    .then((products) => {
      fetchedProduct = products[0];

      const oldQuantity = fetchedProduct.cartItem.quantity;
      newQuantity = oldQuantity - 1;

      return fetchedProduct;
    })
    .then((product) => {
      if (newQuantity) {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      } else product.cartItem.destroy();
    })
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
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) =>
          order.addProduct(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          )
        )
        .catch((err) => console.log(err));
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
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
