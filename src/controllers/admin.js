const Product = require("../models/product");

exports.allProducts = (req, res, next) => {
  Product.findAll().then((products) => {
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
  });
};

exports.editProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findByPk(id).then((product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      product,
      url: "/admin/products",
    });
  });
};

exports.saveProduct = (req, res, next) => {
  const { id, title, description, image, price } = req.body;
  if (id) {
    Product.findByPk(id)
      .then((product) => {
        product.title = title;
        product.description = description;
        product.image = image;
        product.price = price;
        return product.save();
      })
      .then(() => res.redirect("/admin/products"))
      .catch((err) => console.log("product editing error", err));
  } else {
    Product.create({
      title,
      description,
      price,
      image,
    })
      .then(() => res.redirect("/admin/products"))
      .catch((err) => console.log("product creating error", err));
  }
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.destroy({ where: { id } })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log("Error while deleting product", err));
};

// exports.allProducts = (req, res, next) => {
//   Product.fetchAll().then((products) => {
//     res.render("admin/products", {
//       pageTitle: "Admin products",
//       products,
//       url: "/admin/products",
//     });
//   });
// };

// exports.addProduct = (req, res, next) => {
//   res.render("admin/add-product", {
//     pageTitle: "Add product",
//     url: "/admin/products/add",
//   });
// };

// exports.editProduct = (req, res, next) => {
//   const id = req.params.id;
//   Product.findById(id).then((product) => {
//     res.render("admin/edit-product", {
//       pageTitle: "Edit product",
//       product,
//       url: "/admin/products",
//     });
//   });
// };

// exports.saveProduct = (req, res, next) => {
//   const { id, title, description, image, price } = req.body;
//   const product = new Product(title, description, image, price, id);
//   product.save().then(() => {
//     res.redirect("/admin/products");
//   });
// };

// exports.deleteProduct = (req, res, next) => {
//   const id = req.params.id;
//   Product.delete(id);

//   res.redirect("/admin/products");
// };
