const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/is-auth");

const shopController = require("./../controllers/shop");

router.get("/", (req, res, next) => {
  return res.redirect("/products");
});

router.get("/products", shopController.getProducts);

router.get("/products/:id", shopController.getProductDetails);

router.get("/cart", isAuth, shopController.getCartItems);

router.post("/cart/add", isAuth, shopController.addToCart);

router.post("/cart/remove", isAuth, shopController.removeFromCart);

router.post("/cart/delete", isAuth, shopController.deleteFromCart);

router.post("/cart/checkout", isAuth, shopController.checkout);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
