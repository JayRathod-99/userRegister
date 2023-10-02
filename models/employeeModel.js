const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const employeeSchema = new mongoose.Schema({
  productId: {
    type: "String",
  },
  companyId: {
    type: "String",
  },
  employee_name: {
    type: "String",
    require: true,
  },
  employee_email: {
    type: "String",
    require: true,
    unique: true,
  },
  password: {
    type: "String",
    require: true,
  },
  employee_phone: {
    type: Number,
    require: true,
  },
  employee_city: {
    type: "String",
  },

  employee_profileImage: {
    type: "String",
    require: false,
  },
  otp: {
    type: "string",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
