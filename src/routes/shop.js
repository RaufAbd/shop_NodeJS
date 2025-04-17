const express = require("express");

const router = express.Router();

const shopController = require("./../controllers/shop");

router.get("/products", shopController.getProducts);

router.get("/products/:id", shopController.getProductDetails);

router.get("/cart", shopController.getCartItems);

router.post("/cart/add", shopController.addToCart);

router.post("/cart/remove", shopController.removeFromCart);

router.post("/cart/delete", shopController.deleteFromCart);

router.get("/orders", shopController.getOrders);

module.exports = router;
