// @ts-nocheck
const User = require("./../models/userModel");
const Product = require("../models/proudcModel");
const Employee = require("../models/employeeModel");
const AppError = require("../utils/appError");
const catchAcync = require("./../utils/catchAsync");
const middlewares = require("./../utils/middleware");
const { deleteUser } = require("./userController");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

//add product two tables at time(put userID into product table)
exports.addProduct = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone_no,
      city: req.body.city,
      // password: req.body.password,
    });
    await user
      .save()
      .then(async (user_data) => {
        if (user_data) {
          console.log(user_data);

          const prd = new Product({
            userId: user_data._id,
            product_name: req.body.p_name,
            product_price: req.body.p_price,
            product_details: req.body.p_detail,
            email: req.body.email,
          });
          await prd.save().then(async (product_data) => {
            if (product_data) {
              let response = {
                user_data,
                product_data,
              };
              res.send(
                middlewares.responseMiddleWares(
                  "data insert sucessfully",
                  true,
                  response,
                  200
                )
              );
            } else {
              res.send(
                middlewares.responseMiddleWares(
                  "data not insert in second table",
                  false,
                  undefined,
                  100
                )
              );
            }
          });
        } else {
          res.send(
            middlewares.responseMiddleWares(
              "data not insert",
              false,
              undefined,
              400
            )
          );
        }
      })
      .catch((err) => {
        res.send(middlewares.responseMiddleWares(err, false, undefined, 500));
      });
  } catch (err) {
    res.send(middlewares.responseMiddleWares(err, false, undefined, 400));
  }
};

// exports.addProduct = async (req, res) => {
//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone_no,
//     city: req.body.city,
//     password: req.body.password,
//   });
//   const data = await user.save();
//   if (data) {
//     const prd = new Product({
//       userId: data._id,
//       product_name: req.body.p_name,
//       product_price: req.body.p_price,
//       product_details: req.body.p_detail,
//       email: req.body.email,
//     });
//     const dta = await prd.save();
//     if (dta) {
//       const results = { data, dta };
//       res.send(
//         middlewares.responseMiddleWares(
//           "data insert sucessfully",
//           true,
//           { ...results },
//           200
//         )
//       );
//     } else {
//       res.send(
//         middlewares.responseMiddleWares(
//           "data not insert in product table",
//           false,
//           undefined,
//           400
//         )
//       );
//     }
//   } else {
//     res.send(
//       middlewares.responseMiddleWares(
//         "data not insert in user table",
//         false,
//         undefined,
//         400
//       )
//     );
//   }
// };

// exports.editUserProduct = async (req, res) => {
//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone_no,
//     city: req.body.city,
//     password: req.body.password,
//   });
//   const data = await user.save();
//   if (data) {
//     const prd = new Product({
//       userId: data._id,
//       product_name: req.body.p_name,
//       product_price: req.body.p_price,
//       product_details: req.body.p_detail,
//       email: req.body.email,
//     });
//     const dta = await prd.save();
//     if (dta && !dta.userId) {
//       const results = { data, dta };
//       res.send(
//         middlewares.responseMiddleWares(
//           "data insert successfully",
//           true,
//           { ...results },
//           200
//         )
//       );
//     } else {
//       res.send(
//         middlewares.responseMiddleWares(
//           "data not insert in product table",
//           false,
//           undefined,
//           400
//         )
//       );
//     }
//   } else {
//     res.send(
//       middlewares.responseMiddleWares(
//         "data not insert in user table",
//         false,
//         undefined,
//         400
//       )
//     );
//   }
// };

// exports.editUserProduct = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const userData = await User.findById(userId);
//     if (!userData) {
//       res.send(
//         middlewares.responseMiddleWares("User not found", false, undefined, 404)
//       );
//     } else {
//       const updatedProducts = await Product.updateMany(
//         { userId: userId },
//         {
//           product_name: req.body.p_name,
//           product_price: req.body.p_price,
//           product_details: req.body.p_detail,
//           email: req.body.email,
//         }
//       );
//       if (updatedProducts) {
//         res.send(
//           middlewares.responseMiddleWares(
//             "All products updated successfully",
//             true,
//             updatedProducts,
//             200
//           )
//         );
//       } else {
//         res.send(
//           middlewares.responseMiddleWares(
//             "Failed to update products",
//             false,
//             undefined,
//             500
//           )
//         );
//       }
//     }
//   } catch (err) {
//     res.send(middlewares.responseMiddleWares(err, false, undefined, 400));
//   }
// };

exports.editUserProduct = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const existingProduct = await Product.findOne({
      email: email,
    });

    if (existingProduct) {
      const updatedProducts = await Product.findOneAndUpdate(
        email,
        {
          product_name: req.body.p_name,
          product_price: req.body.p_price,
          product_details: req.body.p_detail,
        },
        { new: true }
      );
      res.send(
        middlewares.responseMiddleWares(
          "Product updated success",
          true,
          updatedProducts,
          200
        )
      );
    } else {
      const newProduct = await Product.create({
        email: req.body.email,
        product_name: req.body.p_name,
        product_price: req.body.p_price,
        product_details: req.body.p_detail,
      });
      res.send(
        middlewares.responseMiddleWares(
          "New product created successfully",
          true,
          newProduct,
          200
        )
      );
    }
  } catch (err) {
    res.send(middlewares.responseMiddleWares(err, false, undefined, 400));
  }
};

exports.createProduct = async (req, res) => {
  const existingProduct = await Product.findOne({
    product_name: req.body.p_name,
  });

  if (existingProduct) {
    res.send({
      status: "error",
      message: "Product already exists",
    });
  } else {
    const newProduct = await Product.create({
      product_name: req.body.p_name,
      product_price: req.body.p_price,
      product_details: req.body.p_detail,
    });
    res.send({
      status: "success",
      message: "Product created successfully",
      newProduct,
    });
  }
};

//update through id
// exports.updateProduct = async (req, res) => {
//   // const updateProduct = await Product.update({
//   const id = req.params.id;
//   console.log(id);
//   const updateProductId = await Product.findById(id);

//   // console.log(req.params.id, "jjjj");
//   if (!updateProductId) {
//     res.send({
//       status: "error",
//       message: "Product was not exists",
//     });
//   } else {
//     const updateProduct = await Product.findOneAndUpdate(
//       { _id: req.params.id },
//       {
//         product_name: req.body.p_name,
//         product_price: req.body.p_price,
//         product_details: req.body.p_detail,
//       },
//       { new: true }
//     );
//     res.send({
//       status: "success",
//       message: "Product updated successfully.",
//       updateProduct,
//     });
//   }
// };

//update through email address
// exports.updateProduct = async (req, res) => {
//   const updateProductEmail = await Product.findOne({ email: req.body.email });

//   if (!updateProductEmail) {
//     res.send({
//       status: "error",
//       message: "This email was not exists",
//     });
//   } else {
//     const updateProduct = await Product.findOneAndUpdate(
//       req.body.email,
//       {
//         product_name: req.body.p_name,
//         product_price: req.body.p_price,
//         product_details: req.body.p_detail,
//       },
//       { new: true }
//     );
//     res.send({
//       status: "success",
//       message: "Product updated successfully.",
//       updateProduct,
//     });
//   }
// };

//simple delete product
// exports.deleteProduct = async (req, res) => {
//   const p_id = req.params.id;
//   const productDelete = await Product.findOneAndDelete( p_id);

//   if (productDelete) {
//     res.json({
//       status: "success",
//       message: "Product deleted successfully.",
//     });
//   } else {
//     res.status(404).send("Product not found");
//   }
// };

//delete product through uesrObject id
exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findById(userId);
    const deleteProduct = await Product.findOne({ userId });

    if (!deletedUser && !deleteProduct) {
      return res.status(404).json({
        status: "fail",
        message: "User or product not found",
      });
    } else {
      const id = await User.findByIdAndDelete(userId);
      const productId = await Product.findOneAndDelete({ userId });

      return res.status(200).json({
        status: "success",
        message: "Product and user deleted successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the product",
      error: err.message,
    });
  }
};

//update product through userObj id
// exports.updateProducts = async (req, res) => {
//   const id = req.body.id;
//   console.log("S1:", id);

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone_no,
//         city: req.body.city,
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const updatedProduct = await Product.findOneAndUpdate(
//       { userId: id },
//       {
//         userId: req.body.userId,
//         product_name: req.body.product_name,
//         product_price: req.body.product_price,
//         product_details: req.body.product_details,
//         email: req.body.email,
//       },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const response = {
//       user_data: updatedUser,
//       product_data: updatedProduct,
//     };

//     return res.status(200).json(response);
//   } catch (err) {
//     return res.status(500).json({
//       status: "error",
//       message: "An error occurred while updating the product",
//       error: err.message,
//     });
//   }
// };

//update
// exports.updateProducts = async (req, res) => {
//   const userEmail = req.body.email;

//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       { email: userEmail },
//       {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone_no,
//         city: req.body.city,
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       const newUser = await User.create({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone_no,
//         city: req.body.city,
//       });

//       return res.status(200).json({ message: "user created.", newUser });
//     }

//     const updatedProduct = await Product.findOneAndUpdate(
//       { email: req.body.email },
//       {
//         product_name: req.body.product_name,
//         product_price: req.body.product_price,
//         product_details: req.body.product_details,
//         email: req.body.email,
//       },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       const newProduct = await Product.create({
//         product_name: req.body.product_name,
//         product_price: req.body.product_price,
//         product_details: req.body.product_details,
//         email: req.body.email,
//       });

//       return res.status(200).json({ message: "Product created.", newProduct });
//     }

//     const response = {
//       user_data: updatedUser,
//       product_data: updatedProduct,
//     };

//     return res.status(200).json(response);
//   } catch (err) {
//     return res.status(500).json({
//       status: "error",
//       message: "An error occurred while updating the product",
//       error: err.message,
//     });
//   }
// };

//update through email
// exports.updateProducts = async (req, res) => {
//   const userEmail = req.body.email;

//   try {
//     let updatedUser = await User.findOne({ email: userEmail });

//     if (!updatedUser) {
//       const newUser = await User.create({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone_no,
//         city: req.body.city,
//       });

//       updatedUser = newUser;
//     } else {
//       updatedUser.name = req.body.name;
//       updatedUser.phone = req.body.phone_no;
//       updatedUser.city = req.body.city;
//       await updatedUser.save();
//     }

//     let updatedProduct = await Product.findOne({ email: userEmail });

//     if (!updatedProduct) {
//       const newProduct = await Product.create({
//         product_name: req.body.product_name,
//         product_price: req.body.product_price,
//         product_details: req.body.product_details,
//         email: req.body.email,
//       });

//       updatedProduct = newProduct;
//     } else {
//       updatedProduct.product_name = req.body.product_name;
//       updatedProduct.product_price = req.body.product_price;
//       updatedProduct.product_details = req.body.product_details;
//       await updatedProduct.save();
//     }

//     const response = {
//       user_data: updatedUser,
//       product_data: updatedProduct,
//     };

//     return res.status(200).json(response);
//   } catch (err) {
//     return res.status(500).json({
//       status: "error",
//       message: "An error occurred while updating the product",
//       error: err.message,
//     });
//   }
// };

//update through object id
// exports.updateProducts = async (req, res) => {
//   const userId = req.body.userId;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone_no,
//         city: req.body.city,
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       const newUser = await User.create({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone_no,
//         city: req.body.city,
//       });

//       return res.status(200).json({ message: "user created.", newUser });
//     }

//     const updatedProduct = await Product.findOneAndUpdate(
//       { userId: userId },
//       {
//         product_name: req.body.product_name,
//         product_price: req.body.product_price,
//         product_details: req.body.product_details,
//         userId: userId,
//       },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       const newProduct = await Product.create({
//         product_name: req.body.product_name,
//         product_price: req.body.product_price,
//         product_details: req.body.product_details,
//         userId: userId,
//       });

//       return res.status(200).json({ message: "Product created.", newProduct });
//     }

//     const response2 = {
//       user_data: updatedUser,
//       product_data: updatedProduct,
//     };

//     return res.status(200).json(response2);
//   } catch (err) {
//     return res.status(500).json({
//       status: "error",
//       message: "An error occurred while updating the product",
//       error: err.message,
//     });
//   }
// };

exports.updateProducts = async (req, res) => {
  const userEmail = req.body.email;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone_no,
        city: req.body.city,
      },
      { new: true, upsert: true }
    );

    const updatedProduct = await Product.findOneAndUpdate(
      { email: req.body.email },
      {
        userId: updatedUser._id,
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_details: req.body.product_details,
        email: req.body.email,
      },
      { new: true, upsert: true }
    );

    const response = {
      user_data: updatedUser,
      product_data: updatedProduct,
    };

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the product",
      error: err.message,
    });
  }
};

//get product details from email
// exports.getAllData = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const data = await User.aggregate([
//       {
//         $match: { email: email },
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "email",
//           foreignField: "email",
//           as: "products",
//         },
//       },
//     ]);

//     if (!data) {
//       res.status(404).json({ status: "failed", messgae: "data not found" });
//     } else {
//       res.status(200).json({ status: "success", data });
//     }
//   } catch (err) {
//     res.send(404).json({
//       message: "something went wrong",
//     });
//   }
// };

//get all data user and product if data was not found that data will not display.(using email)
// exports.getAllData = async (req, res) => {
//   try {
//     // const email = req.params.email;
//     const data = await User.aggregate([
//       {
//         $lookup: {
//           from: "products",
//           localField: "email",
//           foreignField: "email",
//           as: "Product",
//         },
//       },
//       // {
//       //   $unwind: "$Product",
//       // },
//       {
//         $match: { $or: [{ Product: { $ne: [] } }, { product: "null" }] },
//       },
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

//get data from two tables using id (original code )
// exports.getAllData = async (req, res) => {
//   try {
//     // const email = req.params.email;
//     const data = await User.aggregate([
//       {
//         $addFields: {
//           user_id: { $toString: "$_id" },
//         },
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "email",
//           foreignField: "email",
//           as: "Product",
//         },
//       },
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

//test -1: get data from two tables using id (demo code )
// exports.getAllData = async (req, res) => {
//   try {
//     // const email = req.params.email;
//     const data = await User.aggregate([
//       {
//         $addFields: {
//           user_id: { $toString: "$_id" },
//         },
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "user_id",
//           foreignField: "userId",
//           as: "Product",
//         },
//       },
//       {
//         $project: {
//           email: 1,
//           city: 1,
//           phone: 1,

//           "Product.product_name": 1,
//           "Product.product_price": 1,
//           "Product.product_details": 1,
//         },
//       },
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

//get products with highest price
// exports.getHighestProductData = async (req, res) => {
//   try {
//     // const data = await Product.find().sort({ product_price: -1 });

//     const data = await User.aggregate([
//       {
//         $addFields: {
//           user_id: { $toString: "$_id" },
//         },
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "user_id",
//           foreignField: "userId",
//           as: "Product",
//         },
//       },
//       // {
//       //   $unwind: "$Product",
//       // },
//       {
//         $sort: {
//           "Product.product_name": 1,
//           "Product.product_details": 1,
//           "Product.product_price": -1,
//         },
//       },
//       // {
//       //   $limit: 1,
//       // },
//       {
//         $project: {
//           email: 1,
//           city: 1,
//           phone: 1,
//           "Product.product_name": 1,
//           "Product.product_details": 1,
//           "Product.product_price": 1,
//         },
//       },
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

//get products with highest price (shows only onedata with highest price from second table)
exports.getHighestProductData = async (req, res) => {
  try {
    // const data = await Product.find().sort({ product_price: -1 });

    const data = await User.aggregate([
      {
        $addFields: {
          user_id: { $toString: "$_id" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "user_id",
          foreignField: "userId",
          as: "Product",
        },
      },
      {
        $unwind: "$Product",
      },
      {
        $sort: {
          "Product.product_price": -1,
        },
      },
      {
        $limit: 1,
      },
      // {
      //   $project: {
      //     email: 1,
      //     city: 1,
      //     phone: 1,
      //     "Product.product_name": 1,
      //     "Product.product_details": 1,
      //     "Product.product_price": 1,
      //   },
      // },
      {
        $group: {
          _id: "$_id",
          email: { $first: "$email" },
          city: { $first: "$city" },
          phone: { $first: "$phone" },
          Product: { $first: "$Product" },
        },
      },
    ]);

    if (!data || data.length === 0) {
      res.status(404).json({ status: "failed", message: "data not found" });
    } else {
      res.status(200).json({ status: "success", data });
    }
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      error: err,
    });
  }
};

//get products details without array(display direct data with user)
exports.getAllProductData = async (req, res) => {
  try {
    // const data = await Product.find().sort({ product_price: -1 });

    const data = await User.aggregate([
      {
        $addFields: {
          user_id: { $toString: "$_id" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "user_id",
          foreignField: "userId",
          as: "Product",
        },
      },
      {
        $unwind: "$Product",
      },
      // {
      //   $sort: {
      //     "Product.product_price": -1,
      //   },
      // },
      {
        $group: {
          _id: "$_id",
          email: { $first: "$email" },
          city: { $first: "$city" },
          phone: { $first: "$phone" },
          Product: { $first: "$Product" },
        },
      },
      {
        $project: {
          _id: 0,
          email: 1,
          city: 1,
          phone: 1,
          product_name: "$Product.product_name",
          product_details: "$Product.product_details",
          product_price: "$Product.product_price",
        },
      },
    ]);

    if (!data || data.length === 0) {
      res.status(404).json({ status: "failed", message: "data not found" });
    } else {
      res.status(200).json({ status: "success", data });
    }
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      error: err,
    });
  }
};

//create table with entry into 3 tables
exports.addProductwithEmp = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone_no,
      city: req.body.city,
    });

    const user_data = await user.save();
    console.log("user_data:", user_data);
    if (user_data) {
      const product = new Product({
        userId: user_data._id,
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_details: req.body.product_detail,
        email: req.body.email,
      });

      const product_data = await product.save();
      console.log("product_data:", product_data);
      if (product_data) {
        const emp = new Employee({
          productId: product_data._id,
          employee_name: req.body.employee_name,
          employee_email: req.body.employee_email,
          employee_phone: req.body.employee_phone,
          employee_city: req.body.employee_city,
        });

        const emp_data = await emp.save();
        console.log("emp_data:", emp_data);
        if (emp_data) {
          const response = {
            user_data,
            product_data,
            emp_data,
          };

          res.status(200).json({
            status: "success",
            message: "Data inserted successfully",
            data: response,
          });
        } else {
          res.status(400).json({
            status: "failed",
            message: "Data not inserted in employee table",
          });
        }
      } else {
        res.status(400).json({
          status: "failed",
          message: "Data not inserted in product table",
        });
      }
    } else {
      res.status(400).json({
        status: "failed",
        message: "Data not inserted in user table",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding the product",
      error: err.message,
    });
  }
};

//get user email using employee objId(passing object in body)
exports.getUserEmail = async (req, res) => {
  try {
    const employeeId = req.body.employee_id;

    const employee = await Employee.findOne({ _id: employeeId });
    console.log("employee", employee);
    if (!employee) {
      return res.status(404).json({
        status: "failed",
        message: "employee Id not found",
      });
    }

    const product = await Product.findOne({ _id: employee.productId });
    console.log("product", product);
    if (!product) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found",
      });
    }

    const user = await User.findOne({ _id: product.userId }, { email: 1 });
    console.log("user", user);
    if (user) {
      const userEmail = user.email;
      res.status(200).json({
        status: "success",
        message: "user email retrieved successfully",
        data: [userEmail],
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "user Id not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

// test_1 (original)
// exports.getUserEmail = async (req, res) => {
//   try {
//     const employees = await Employee.find()
//       .populate({
//         path: "productId",
//         model: "Product",
//         populate: {
//           path: "userId",
//           model: "User",
//           select: "email",
//         },
//       })
//       .exec();
//     // console.log("stap 1:", employees);

//     const userEmails = employees
//       .filter((employee) => employee.productId && employee.productId.userId)
//       .map((employee) => employee.productId.userId.email);

//     console.log("userEmails", userEmails);

//     res.status(200).json({
//       status: "success",
//       message: "User emails retrieved successfully",
//       data: userEmails,
//       // employees,
//     });

//     // console.log("employee:", employees);
//     if (!employees) {
//       return res.status(404).json({
//         status: "failed",
//         message: "employee Id not found",
//       });
//     }
//   } catch (error) {
//     res.status(404).json({
//       status: "error",
//       message: "Something went wrong",
//     });
//   }
// };

//test_2
exports.getUserEmail = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate({
        path: "productId",
        model: "Product",
        populate: {
          path: "userId",
          select: "email",
        },
      })
      .exec();
    console.log("step 1:", employees);

    const userEmails = employees
      .filter((employee) => {
        return (
          employee.productId &&
          employee.productId.userId &&
          employee.productId.userId.email
        );
      })
      .map((employee) => employee.productId.userId.email);

    // const missingEmails = employees
    //   .filter((employee) => {
    //     return (
    //       !employee.productId ||
    //       !employee.productId.userId ||
    //       !employee.productId.userId.email
    //     );
    //   })
    //   .map((employee) => employee._id.toString());

    res.status(200).json({
      status: "success",
      message: "User emails retrieved successfully",
      data: userEmails,
      // missingEmails,
    });

    console.log("employees:", employees);

    if (!employees) {
      return res.status(404).json({
        status: "failed",
        message: "employee Id not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

//get email without passing objectId in body(using aggregation)
// exports.getUserEmail = async (req, res) => {
//   try {
//     const employees = await Employee.aggregate([
//       {
//         $lookup: {
//           from: "products",
//           localField: "productId",
//           foreignField: "id",
//           as: "product",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "product.userId",
//           foreignField: "id",
//           as: "user",
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           email: "$user.email",
//         },
//       },
//       {
//         $match: {
//           email: { $ne: [] },
//         },
//       },
//     ]);

//     console.log(employees);

//     if (employees.length === 0) {
//       return res.status(404).json({
//         status: "failed",
//         message: "Employees not found",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       message: "User emails retrieved successfully",
//       employees,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };
