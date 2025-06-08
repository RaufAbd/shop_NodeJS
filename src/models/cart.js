const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = Cart;

// const fs = require("fs");
// const path = require("path");

// const filePath = path.join(__dirname, "../data/cart.json");

// const getCartFromFile = (cb) => {
//   fs.readFile(filePath, (err, data) => {
//     if (err) cb({ products: [], totalPrice: 0 });
//     else cb(JSON.parse(data));
//   });
// };

// module.exports = class Cart {
//   static add(product) {
//     getCartFromFile((cart) => {
//       const existingProductIndex = cart.products.findIndex(
//         (prod) => prod.id === product.id
//       );

//       const existingProduct = cart.products[existingProductIndex];
//       let updatedProduct;

//       if (existingProduct) {
//         updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
//         cart.products[existingProductIndex] = updatedProduct;
//       } else {
//         updatedProduct = { ...product, qty: 1 };
//         cart.products.push(updatedProduct);
//       }
//       cart.totalPrice = cart.totalPrice + +updatedProduct.price;

//       fs.writeFile(filePath, JSON.stringify(cart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static fetchAll(cb) {
//     getCartFromFile(cb);
//   }

//   static delete(id) {
//     getCartFromFile((cart) => {
//       const product = cart.products.find((prod) => prod.id === id);
//       const productTotalPrice = product.qty * product.price;
//       const updatedCart = {
//         ...cart,
//         products: cart.products.filter((prod) => prod.id !== id),
//         totalPrice: cart.totalPrice - productTotalPrice,
//       };

//       fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static remove(id) {
//     getCartFromFile((cart) => {
//       let updatedProducts = [...cart.products];

//       const index = updatedProducts.findIndex((prod) => prod.id === id);
//       const updatedProduct = { ...updatedProducts[index] };

//       if (updatedProduct.qty > 1) {
//         updatedProduct.qty--;
//         updatedProducts[index] = updatedProduct;
//       } else {
//         updatedProducts = cart.products.filter((prod) => prod.id !== id);
//       }
//       const updatedCart = {
//         ...cart,
//         products: updatedProducts,
//         totalPrice: cart.totalPrice - updatedProduct.price,
//       };

//       fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
//         console.log(err);
//       });
//     });
//   }
// };
