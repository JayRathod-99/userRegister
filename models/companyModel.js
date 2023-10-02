const mongoose = require("mongoose");

const company = new mongoose.Schema({
  employeeId: {
    type: "string",
  },
  
  email: {
    type: "string",
  },

  company_name: {
    type: "string",
  },

  company_department: {
    type: "String",
  },

  company_image: {
    type: String,
  },

  created_at: {
    type: "Date",
  },
});

const Company = mongoose.model("Company", company);
module.exports = Company;
