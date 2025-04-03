const express = require("express");

const router = express.Router();

const shopController = require("./../controllers/shop");

router.get("/products", shopController.getProducts);
router.get("/products:id", shopController.getProductDetails);
router.get("/cart", shopController.getCartItems);
router.get("/orders", shopController.getOrders);

module.exports = router;
