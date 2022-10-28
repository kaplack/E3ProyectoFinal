import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  timeStamp: { type: String, require: true, max: 100 },
  userID: { type: String, require: true, max: 100 },
  items: {},
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
