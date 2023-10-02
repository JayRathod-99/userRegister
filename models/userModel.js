const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    require: true,
  },
  email: {
    type: "String",
    require: true,
    unique: true,
  },
  password: {
    type: "String",
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  city: {
    type: "String",
  },
  profileImage: {
    type: "String",
    require: false,
  },
  otp: {
    type: "string",
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const hased = await bcrypt.hash(this.password, 10);
    this.password = hased;
    this.passwordConfirm = undefined;

    return next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
