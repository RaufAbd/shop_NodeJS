const express = require("express");

const router = express.Router();

const adminController = require("./../controllers/admin");

router.get("/admin", adminController.allProducts);
router.get("/add-product", adminController.addProduct);
router.post("/save-product", adminController.saveProduct);
router.post("/delete-product/:id", adminController.deleteProduct);
router.get("/edit-product/:id", adminController.editProduct);

module.exports = router;
