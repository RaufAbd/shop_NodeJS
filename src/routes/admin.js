const express = require("express");

const router = express.Router();

const adminController = require("./../controllers/admin");
const API = "/admin/products";

router.get(`${API}`, adminController.allProducts);

router.get(`${API}/add`, adminController.addProduct);

router.get(`${API}/edit/:id`, adminController.editProduct);

router.post(`${API}/delete/:id`, adminController.deleteProduct);

router.post(`${API}/save`, adminController.saveProduct);

module.exports = router;
