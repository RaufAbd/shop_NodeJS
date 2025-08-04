const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const currentPage = +req.query.page || 1;
  let totalPages = 0;
  Product.countDocuments()
    .then((totalItems) => {
      totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      return Product.find()
        .skip((currentPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "All products",
        products,
        url: "/products",
        totalPages,
        currentPage,
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
    .populate("cart.items.productId")
    .then((user) => {
      let totalPrice = 0;
      const products = user.cart.items.map(({ productId, quantity }) => {
        const { price } = productId._doc;

        totalPrice += price * quantity;
        return {
          ...productId._doc,
          quantity,
        };
      });

      res.render("shop/cart", {
        pageTitle: "Your Cart",
        cart: products,
        totalPrice,
        url: "/cart",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteFromCart = (req, res, next) => {
  const itemId = req.body.itemId;

  req.user
    .deleteFromCart(itemId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.removeFromCart = (req, res, next) => {
  const itemId = req.body.itemId;

  req.user
    .removeFromCart(itemId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map(({ productId, quantity }) => {
        return { product: { ...productId._doc }, quantity };
      });

      const order = new Order({
        user: {
          email: req.user.email,
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        orders,
        url: "/orders",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized."));
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("src", "data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + invoiceName + '"'
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", { underline: true });
      pdfDoc.text("---------------------------");

      let totalPrice = 0;
      order.products.forEach(({ product, quantity }) => {
        totalPrice += quantity * product.price;
        pdfDoc
          .fontSize(14)
          .text(product.title + " - " + quantity + " x " + "$" + product.price);
      });

      pdfDoc.text("----");
      pdfDoc.fontSize(18).text("Total price: $" + totalPrice);

      pdfDoc.end();

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'attachment; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });

      // const file = fs.createReadStream(invoicePath);
      // file.pipe(res);
    })
    .catch((err) => next(err));
};
