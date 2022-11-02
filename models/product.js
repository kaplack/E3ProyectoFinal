import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  timeStamp: { type: String, require: true, max: 100 },
  userID: { type: String, require: true, max: 100 },
  name: { type: String, require: true, max: 100 },
  description: { type: String, require: true, max: 100 },
  thumbnail: { type: String, require: true, max: 100 },
  price: { type: Number, require: true },
  stock: { type: Number, require: true },
});

const ProductModel = mongoose.model("products", productsSchema);

export default ProductModel;
