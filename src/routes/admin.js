const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const adminController = require("./../controllers/admin");
const API = "/admin/products";

router.get(`${API}`, isAuth, adminController.allProducts);

router.get(`${API}/add`, isAuth, adminController.addProduct);

router.get(`${API}/edit/:id`, isAuth, adminController.editProduct);

router.post(`${API}/delete/:id`, isAuth, adminController.deleteProduct);

router.post(
  `${API}/save`,
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("description").isLength({ min: 3, max: 400 }).trim(),
    body("price").isFloat(),
  ],
  isAuth,
  adminController.saveProduct
);

module.exports = router;
