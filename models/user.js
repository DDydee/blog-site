const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    login: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    listOfRatedPosts: {},
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
