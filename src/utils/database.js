const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://araxisr4:pJrEkkZA2XHp4Rg4@cluster0.ueue7w1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
