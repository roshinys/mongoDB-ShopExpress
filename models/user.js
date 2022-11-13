const mongodb = require("mongodb");
const getDB = require("../util/database").getDB;

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
  save() {
    const db = getDB();
    return db
      .collections("users")
      .insertOne(this)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static findById(userId) {
    const db = getDB();
    // console.log("inside model user ==>", userId);
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
