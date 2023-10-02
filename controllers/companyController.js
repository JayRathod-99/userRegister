const Employee = require("./../models/employeeModel");
const Company = require("./../models/companyModel");
const middlewares = require("./../utils/middleware");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
require("dotenv").config();

//add Employee data
// exports.addEmployee = async (req, res) => {
//   try {
//     const employee = new Employee({

//       employee_name: req.body.emp_name,
//       employee_email: req.body.email,
//       employee_phone: req.body.emp_phone,
//       employee_city: req.body.emp_city,
//     });
//     await employee
//       .save()
//       .then(async (emp_details) => {
//         if (emp_details) {
//           const companyDetails = new Company({
//             employeeId: emp_details._id,
//             email: req.body.email,
//             company_Name: req.body.company_name,
//             company_Department: req.body.company_Department,
//           });
//           await companyDetails.save().then((companyData) => {
//             if (companyData) {
//               let company_data = {
//                 emp_details,
//                 companyData,
//               };
//               res.send(
//                 middlewares.responseMiddleWares(
//                   "data insert sucessfully",
//                   true,
//                   company_data,
//                   200
//                 )
//               );
//             } else {
//               res.send(
//                 middlewares.responseMiddleWares(
//                   "data not insert in second table",
//                   false,
//                   undefined,
//                   100
//                 )
//               );
//             }
//           });
//         }
//       })
//       .catch((err) => {
//         res.send(middlewares.responseMiddleWares(err, false, undefined, 500));
//       });
//   } catch (err) {
//     res.send(middlewares.responseMiddleWares(err, false, undefined, 400));
//   }
// };

//getEmpData
// exports.getEmpData = async (req, res) => {
//   try {
//     // const email = req.params.email;
//     const data = await Employee.aggregate([
//       {
//         $addFields: {
//           emp_id: { $toString: "$_id" },
//         },
//       },
//       {
//         $lookup: {
//           from: "companies",
//           localField: "emp_id",
//           foreignField: "employeeId",
//           as: "Employee",
//         },
//       },
//       // {
//       //   $project: {
//       //     employee_name: 1,
//       //     employee_email: 1,
//       //     employee_phone: 1,
//       //     employee_city: 1,
//       //   },
//       // },
//       // {
//       //   $project: {
//       //     email: 1,
//       //     city: 1,
//       //     name: 1,
//       //     phone: 1,
//       //     "Product.product_details": 1,
//       //     "Product.product_name": 1,
//       //     "Product.product_price": 1,
//       //   },
//       // },
//       // {
//       //   $addFields: {
//       //     name: "$join.name",
//       //     city: "$join.city",
//       //     user_id: "$join.removed",
//       //   },
//       // },
//     ]);

//     if (!data || data.length === 0) {
//       res.status(404).json({ status: "failed", message: "data not found" });
//     } else {
//       res.status(200).json({ status: "success", data });
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: "something went wrong",
//       error: err,
//     });
//   }
// };

// add new employee
exports.addEmployee = async (req, res) => {
  try {
    const addEmp = new Employee({
      companyId: req.body.companyId,
      employee_email: req.body.employee_email,
      employee_name: req.body.employee_name,
      employee_city: req.body.employee_city,
      employee_phone: req.body.employee_phone,
    });

    const employee = await addEmp.save();

    if (employee) {
      res.status(200).json({
        status: "success",
        message: "data added successfully",
        employee,
      });
    } else {
      res.status(404).json({
        message: "data was not added successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

// create new company simple
// exports.addCompany = async (req, res) => {
//   try {
//     const addCompany = new Company({
//       employeeId: req.body.employeeId,
//       email: req.body.email,
//       company_department: req.body.company_Department,
//       company_name: req.body.company_Name,
//     });

//     const company = await addCompany.save();

//     if (company) {
//       res.status(200).json({
//         status: "success",
//         message: "data added successfully",
//         company,
//       });
//     } else {
//       res.status(404).json({
//         message: "data was not added successfully",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "something went wrong",
//     });
//   }
// };

//create new company with date
exports.addCompany = async (req, res) => {
  try {
    const addCompany = new Company({
      created_at: new Date(),
      employeeId: req.body.employeeId,
      email: req.body.email,
      company_department: req.body.company_Department,
      company_name: req.body.company_Name,
    });

    const company = await addCompany.save();

    if (company) {
      res.status(200).json({
        status: "success",
        message: "data added successfully",
        company,
      });
    } else {
      res.status(404).json({
        message: "data was not added successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

// exports.getEmpData = async (req, res) => {
//   try {
//     // const companyId = req.body.id;
//     // const employeeId = req.body.id;

//     const getEmployeeData = await Employee.findOne({
//       employeeId: req.body.employeeId,
//     });

//     const getCompanyData = await Company.findOne({
//       companyId: req.body.companyId,
//     });

//     if (getCompanyData || getEmployeeData) {
//       res.status(200).json({
//         status: "success",
//         getCompanyData,
//         getEmployeeData,
//       });
//     } else {
//       res.status(500).json({
//         message: "data not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "something went wrong",
//     });
//   }
// };

//get company data and emp data with id simple
// exports.getEmpData = async (req, res) => {
//   try {
//     const data = await Company.aggregate([
//       {
//         $addFields: {
//           company_id: { $toString: "$_id" },
//         },
//       },
//       {
//         $lookup: {
//           from: "employees",
//           localField: "company_id",
//           foreignField: "companyId",
//           as: "employeesDetails",
//         },
//       },
//       {
//         $project: {
//           email: 1,
//           company_name: 1,
//           company_department: 1,
//           "employeesDetails.companyId": 1,
//           "employeesDetails.employee_name": 1,
//           "employeesDetails.employee_email": 1,
//           "employeesDetails.employee_phone": 1,
//         },
//       },
//     ]);
//     console.log(data, "result");

//     if (!data || data.length === 0) {
//       res.status(404).json({ status: "failed", message: "data not found" });
//     } else {
//       res.status(200).json({ status: "success", data });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "something went wrong",
//     });
//   }
// };

//getEmpData in body
// exports.getEmpData = async (req, res) => {
//   try {
//     const company_Id = req.body._id;
//     // console.log("companyId1:", company_Id);
//     if (!company_Id) {
//       res.status(404).json({ status: "failed", message: "data not found" });
//     }

//     const data = await Company.aggregate([
//       {
//         $addFields: {
//           company_Id: { $toString: "$_id" },
//         },
//       },
//       {
//         $lookup: {
//           from: "employees",
//           localField: "company_Id",
//           foreignField: "companyId",
//           as: "employeesDetails",
//         },
//       },
//       {
//         $project: {
//           email: 1,
//           company_name: 1,
//           company_department: 1,
//           created_at: 1,
//           "employeesDetails.companyId": 1,
//           "employeesDetails.employee_name": 1,
//           "employeesDetails.employee_email": 1,
//           "employeesDetails.employee_phone": 1,
//         },
//       },
//       {
//         $sort: { created_at: "-1" },
//       },
//     ]);

//     console.log(data, "result-2");

//     if (!data || data.length === 0) {
//       res.status(404).json({ status: "failed", message: "data not found" });
//     } else {
//       res.status(200).json({ status: "success", data });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "something went wrong",
//     });
//   }
// };

//get emp data params
// exports.getEmpData = async (req, res) => {
//   try {
//     const company_Id = req.params.id;
//     // console.log("companyId1:", company_Id);
//     if (!company_Id) {
//       res
//         .status(400)
//         .json({ status: "failed", message: "Company ID is required" });
//       return;
//     }

//     const data = await Company.aggregate([
//       // {
//       //   $addFields: { company_Id },
//       // },
//       {
//         $lookup: {
//           from: "employees",
//           localField: "company_Id",
//           foreignField: "companyId",
//           as: "employeesDetails",
//         },
//       },
//       {
//         $project: {
//           email: 1,
//           company_name: 1,
//           company_department: 1,
//           "employeesDetails.companyId": 1,
//           "employeesDetails.employee_name": 1,
//           "employeesDetails.employee_email": 1,
//           "employeesDetails.employee_phone": 1,
//         },
//       },
//     ]);

//     console.log(data, "result-2");

//     if (!data || data.length === 0) {
//       res.status(404).json({ status: "failed", message: "data not found" });
//     } else {
//       res.status(200).json({ status: "success", data });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "something went wrong",
//     });
//   }
// };

//get all data with count
// exports.getalldata = async (req, res) => {
//   try {
//     const allData = await Employee.find();
//     const emp = await Employee.find().count();
//     console.log(emp);
//     // const allData = await Company.aggregate([
//     //   {
//     //     $addFields: {
//     //       companyObjId: { $toString: "$_id" },
//     //     },
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "employees",
//     //       localField: "companyObjId",
//     //       foreignField: "companyId",
//     //       as: "employeeDetails",
//     //     },
//     //   },

//     //   {
//     //     $count: "employees",
//     //   },
//     // ]);

//     console.log(emp, "result");
//     if (emp) {
//       res.status(200).json({
//         status: "success",
//         allData,
//         emp,
//       });
//     } else {
//       res.status(404).json({
//         message: "data not found",
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: "something went wrong",
//     });
//   }
// };

//get data with sorting newest first (company)
exports.getalldata = async (req, res) => {
  try {
    // const allData = await Company.find();
    const emp = await Company.find().sort({ created_at: -1 });
    // .sort({ created_at: -1 });
    console.log(emp);

    console.log(emp, "result");
    if (emp) {
      res.status(200).json({
        status: "success",
        // allData,
        emp,
      });
    } else {
      res.status(404).json({
        message: "data not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

//company image upload api
// exports.addCompanyImage = async (req, res) => {
//   try {
//     const addCompany = new Company({
//       employeeId: req.body.employeeId,
//       email: req.body.email,
//       company_department: req.body.company_Department,
//       company_name: req.body.company_Name,
//     });

//     const company = await addCompany.save();

//     if (company) {
//       res.status(200).json({
//         status: "success",
//         message: "data added successfully",
//         company,
//       });
//     } else {
//       res.status(404).json({
//         message: "data was not added successfully",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "something went wrong",
//     });
//   }
// };

// company image upload api
exports.addCompanyImage = async (req, res) => {
  try {
    const { company_department, email, company_name } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const imageUrl = image
      ? `http://localhost:4000/companyImage/${image}`
      : null;

    const addCompany = new Company({
      email,
      company_department,
      company_name,
      company_image: imageUrl,
    });
    const company = await addCompany.save();

    if (company) {
      res.status(200).json({
        status: "success",
        message: "Data added successfully",
        company,
      });
      // console.log("image:", imageUrl?.slice(35));
    } else {
      res.status(404).json({
        message: "Data was not added successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

//search employee by only name
exports.search_Emp = async (req, res) => {
  try {
    const employee_name = req.body.employee_name;
    const emp = await Employee.find({
      employee_name: { $regex: employee_name, $options: "i" },
    });
    console.log(emp);

    res.send({ emp });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
