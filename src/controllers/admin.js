const fileHelper = require("../utils/file");

const { validationResult } = require("express-validator");
const Product = require("../models/product");

const ITEMS_PER_PAGE = 2;

exports.allProducts = (req, res, next) => {
  const currentPage = +req.query.page || 1;
  let totalPages = 0;
  Product.countDocuments({ userId: req.user._id })
    .then((totalItems) => {
      totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      return Product.find({ userId: req.user._id })
        .skip((currentPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin products",
        products,
        url: "/admin/products",
        totalPages,
        currentPage,
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
      url: `/admin/products/edit${id}`,
      errorMessage: "",
      validationErrors: [],
    });
  });
};

exports.saveProduct = (req, res, next) => {
  const { id, title, description, price } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (id) {
    if (!image) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Edit product",
        product: { title, description, price, _id: id },
        url: `/admin/products/edit${id}`,
        errorMessage: "Attached file is not image.",
        validationErrors: [],
      });
    }

    Product.findById(id)
      .then((product) => {
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect("/");
        }

        if (!errors.isEmpty()) {
          return res.status(422).render("admin/edit-product", {
            pageTitle: "Edit product",
            product: product,
            url: `/admin/products/edit${id}`,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
          });
        }

        product.title = title;
        product.description = description;
        if (image) {
          fileHelper.deleteFile(product.image);
          product.image = image.path;
        }
        product.price = price;

        return product.save().then(() => res.redirect("/admin/products"));
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    if (!image) {
      return res.status(422).render("admin/add-product", {
        pageTitle: "Add product",
        prevInput: { title, description, price },
        url: "/admin/products/add",
        errorMessage: "Attached file is not image.",
        validationErrors: [],
      });
    }

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/add-product", {
        pageTitle: "Add product",
        url: "/admin/products/add",
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
        prevInput: {
          title,
          description,
          price,
        },
      });
    }

    const product = new Product({
      title,
      description,
      image: image.path,
      price,
      userId: req.user._id,
    });

    product
      .save()
      .then(() => res.redirect("/admin/products"))
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.image);
      return Product.deleteOne({ _id: id, userId: req.user._id });
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
