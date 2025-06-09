const mongodb = require("mongodb");
const getDb = require("./../utils/database").getDb;

class Product {
  constructor(title, description, image, price, id, userId) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
    this._id = id;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    const { _id, ...res } = this;
    const productData = res;

    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: productData }
        );
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();

    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(id) {
    const db = getDb();

    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(`${id}`) })
      .next()
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(id) {
    const db = getDb();

    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(`${id}`) })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;

// const fs = require("fs");
// const path = require("path");
// const Cart = require("./cart");

// const db = require("../utils/database");

// const filePath = path.join(__dirname, "../data/products.json");

// const getProductsFromFile = (cb) => {
//   fs.readFile(filePath, (err, data) => {
//     if (err) cb([]);
//     else cb(JSON.parse(data));
//   });
// };

// class Product {
//   constructor(title, description, image, price, id) {
//     this.title = title;
//     this.description = description;
//     this.image = image;
//     this.price = price;
//     this.id = id;
//   }

//   static fetchAll() {
//     return db
//       .execute("SELECT * FROM products")
//       .then(([products]) => products)
//       .catch((err) => {
//         console.log("products error", err);
//       });
//   }

//   static findById(id) {
//     return db
//       .execute("SELECT * FROM products WHERE products.id = ?", [id])
//       .then(([[product]]) => product)
//       .catch((err) => console.log("finding product error", err));
//     // getProductsFromFile((products) => {
//     //   const product = products.find((p) => p.id === id);
//     //   cb(product);
//     // });
//   }

//   save() {
//     return db
//       .execute(
//         "INSERT INTO products (title, price, description, image) VALUES (?,?,?,?)",
//         [this.title, this.price, this.description, this.image]
//       )
//       .catch((err) => console.log("save product error", err));
//     // getProductsFromFile((products) => {
//     //   if (this.id) {
//     //     const index = products.findIndex((prod) => prod.id === this.id);
//     //     const updatedProducts = [...products];

//     //     updatedProducts[index] = this;
//     //     console.log("aloi", this.id);
//     //     fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
//     //       console.log(err);
//     //     });
//     //   } else {
//     //     this.id = Math.random().toString(36).substring(2);
//     //     products.push(this);
//     //     fs.writeFile(filePath, JSON.stringify(products), (err) => {
//     //       console.log(err);
//     //     });
//     //   }
//     // });
//   }

//   static delete(id) {
//     getProductsFromFile((products) => {
//       const updatedProducts = products.filter((product) => product.id !== id);
//       fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
//         console.log(err);
//         if (!err) {
//           Cart.delete(id);
//         }
//       });
//     });
//   }
// }

// module.exports = Product;
