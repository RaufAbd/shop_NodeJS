const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/is-auth");

const adminController = require("./../controllers/admin");
const API = "/admin/products";

router.get(`${API}`, isAuth, adminController.allProducts);

router.get(`${API}/add`, isAuth, adminController.addProduct);

router.get(`${API}/edit/:id`, isAuth, adminController.editProduct);

router.post(`${API}/delete/:id`, isAuth, adminController.deleteProduct);

router.post(`${API}/save`, isAuth, adminController.saveProduct);

module.exports = router;
