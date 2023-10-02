const mongoose = require("mongoose");

const crud = new mongoose.Schema({
  id: {
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

const Crud = mongoose.model("Crud", crud);
module.exports = Crud;
