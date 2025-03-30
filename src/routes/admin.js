const express = require("express");

const router = express.Router();

const adminController = require("./../controllers/admin");

router.get("/new-product", adminController.newProduct);
router.post("/add-product", adminController.addProduct);

module.exports = router;
