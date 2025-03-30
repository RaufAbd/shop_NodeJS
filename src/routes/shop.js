const express = require("express");

const router = express.Router();

const shopController = require("./../controllers/shop");

router.get("/", shopController.getProducts);
router.get("/product/:id", shopController.getProductDetails);
router.get("/cart", shopController.getCartItems);

module.exports = router;
