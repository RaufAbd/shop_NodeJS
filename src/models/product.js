const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(filePath, (err, data) => {
    if (err) cb([]);
    else cb(JSON.parse(data));
  });
};

class Product {
  constructor(title, description, image, price, id) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
    this.id = Math.random().toString(36).substring(2);
  }

  // static products = require("../data/products.json");

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static delete(id) {
    getProductsFromFile((products) => {
      products = products.filter((product) => product.id !== id);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
  static edit(id) {
    getProductsFromFile((products) => {
      products = products.filter((product) => product.id !== id);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
}

module.exports = Product;
