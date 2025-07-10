const { validationResult } = require("express-validator");
const Product = require("../models/product");

exports.allProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }).then((products) => {
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
    errorMessage: "",
    validationErrors: [],
    prevInput: {
      title: "",
      description: "",
      image: "",
      price: "",
    },
  });
};

exports.editProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id).then((product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      product: product,
      url: "/admin/products",
      errorMessage: "",
      validationErrors: [],
    });
  });
};

exports.saveProduct = (req, res, next) => {
  const { id, title, description, image, price } = req.body;
  const errors = validationResult(req);

  if (id) {
    Product.findById(id)
      .then((product) => {
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect("/");
        }

        if (!errors.isEmpty()) {
          return res.status(422).render("admin/edit-product", {
            pageTitle: "Edit product",
            product: product,
            url: "/admin/products",
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
          });
        }

        product.title = title;
        product.description = description;
        product.image = image;
        product.price = price;

        return product.save().then(() => res.redirect("/admin/products"));
      })

      .catch((err) => console.log("product editing error", err));
  } else {
    if (!errors.isEmpty()) {
      return res.status(422).render("admin/add-product", {
        pageTitle: "Add product",
        url: "/admin/products/add",
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
        prevInput: {
          title,
          description,
          image,
          price,
        },
      });
    }

    const product = new Product({
      title,
      description,
      image,
      price,
      userId: req.user._id,
    });

    product
      .save()
      .then(() => res.redirect("/admin/products"))
      .catch((err) => console.log("product creating error", err));
  }
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.deleteOne({ _id: id, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log("Error while deleting product", err));
};
