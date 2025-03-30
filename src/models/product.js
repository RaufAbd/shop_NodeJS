const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/products.json");

class Product {
  constructor(title, description, image, price, id) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
    this.id = id;
  }

  // static products = require("../data/products.json");

  static get products() {
    return JSON.parse(fs.readFileSync(filePath));
  }

  static getProduct(id) {
    return Product.products.find((product) => id === product.id);
  }

  save() {
    const products = Product.products;
    products.push(this);

    fs.writeFileSync(filePath, JSON.stringify(products));
  }
}

module.exports = Product;
