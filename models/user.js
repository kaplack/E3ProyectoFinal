import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, require: true, max: 100 },
  email: { type: String, require: true, max: 100 },
  username: { type: String, require: true, max: 100 },
  age: { type: Number, require: true, max: 100 },
  phone: { type: Number, require: true },
  address: { type: String, require: true, max: 100 },
  avatar: { type: String, require: true, max: 100 },
  password: { type: String, require: true },
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
