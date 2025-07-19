const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    login: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 8 },
    isAdmin: { type: Boolean, required: true, default: false },
    listOfPosts: { type: Array, default: [] },
    listOfRatedPosts: { type: Array, default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
