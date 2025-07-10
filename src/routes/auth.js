const express = require("express");

const { check, body } = require("express-validator");

const router = express.Router();
const authController = require("../controllers/auth");

const User = require("../models/user");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email", "Please enter a valid email.")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email", "Please enter a valid email.")
      .isEmail()
      .custom((email, { req }) => {
        return User.findOne({ email }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email already exists, please pick different one."
            );
          }
        });
      })
      .normalizeEmail({ gmail_remove_dots: false }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }

        return true;
      }),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post(
  "/new-password",
  [
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }

      return true;
    }),
  ],
  authController.postNewPassword
);

module.exports = router;
