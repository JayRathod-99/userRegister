const mongoose = require("mongoose");

const products = new mongoose.Schema({
  userId: {
    type: "String",
  },
  email: {
    type: "String",
  },
  product_name: {
    type: "String",
  },
  product_price: {
    type: "Number",
  },
  product_details: {
    type: "String",
  },
});

const Products = mongoose.model("Product", products);
module.exports = Products;
