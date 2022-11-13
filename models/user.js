const mongodb = require("mongodb");
const getDB = require("../util/database").getDB;

class User {
  constructor(username, email, cart, userId) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this.userId = userId;
  }
  save() {
    const db = getDB();
    return db
      .collection("users")
      .insertOne(this)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() == product._id.toString();
    });
    // console.log(cartProductIndex);
    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1,
      });
    }
    const db = getDB();
    const updatedCart = {
      items: updatedCartItems,
    };
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this.userId) },
        { $set: { cart: updatedCart } }
      );
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
