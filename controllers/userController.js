// @ts-nocheck
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./../models/userModel");
const AppError = require("../utils/appError");
const responseError = require("../utils/middleware");
const catchAcync = require("./../utils/catchAsync");
require("dotenv").config();

// new user registration api
// exports.signup = catchAcync(async (req, res, next) => {
//   const { name, email, phone, password, city } = req.body;

//   // Validate user input
//   if (!email || !phone) {
//     return next(new AppError("Please fill your details", 422));
//   }
//   try {
//     const emailExist = await User.findOne({ email: email });
//     const phoneExist = await User.findOne({ phone: phone });

//     if (emailExist) {
//       return res.status(422).json({ error: "email already exists" });
//     } else if (phoneExist) {
//       return res.status(422).json({ error: "phone already exists" });
//     }

//     const user = new User({ email, phone, password, name, city });
//     const userRegister = await user.save();
//     if (userRegister) {
//       res.status(201).json({
//         status: "success",
//         message: "User registered successfully",
//         data: userRegister,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

//signup with image upload
exports.signup = catchAcync(async (req, res, next) => {
  const { name, email, phone, password, city } = req.body;
  const image = req.file ? req.file.filename : undefined;

  // Validate user input
  if (!email || !phone) {
    return next(new AppError("Please fill your details", 422));
  }
  try {
    const emailExist = await User.findOne({ email: email });
    const phoneExist = await User.findOne({ phone: phone });

    if (emailExist) {
      return res.status(422).json({ error: "email already exists" });
    } else if (phoneExist) {
      return res.status(422).json({ error: "phone already exists" });
    }

    //image url
    const imageUrl = image
      ? `http://localhost:4000/profileImage/${image}`
      : null;

    const user = new User({
      name,
      email,
      phone,
      password,
      city,
      profileImage: imageUrl,
    });

    const userRegister = await user.save();
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: userRegister,
      // imageUrl,
    });
    console.log(imageUrl);
  } catch (err) {
    console.log(err);
  }
});

// Login api
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      res.send(
        responseError.responseMiddleWares(
          "Login Failed..",
          false,
          undefined,
          300
        )
      );
    } else {
      res.send(
        responseError.responseMiddleWares(
          "Login Sucessfully",
          true,
          validPassword,
          200
        )
      );
    }
  } catch (err) {
    res.send(responseError.responseMiddleWares(err, false, undefined, 500));
  }
};

//update password current user
// exports.updatePassword = async (req, res, next) => {
//   try {
//     const updateUserPass = await User.findOne({
//       password: req.body.password,
//     });

//     if (updateUserPass) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(req.body.password, salt);

//       const data = await User.findOneAndUpdate(
//         { email: req.body.email },

//         { password: hashedPassword },
//         { new: true }
//       );

//       console.log(data);
//       res.status(200).json({
//         status: "success",
//         message: "user updated",
//       });
//     } else {
//       res.status(404).json({
//         message: "User not found",
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: "undefined error",
//     });
//   }
// };

//test-2 (update password current user from old password)
exports.updatePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, oldPassword, email } = req.body;

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "email not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "email and oldPassword is not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const data = await User.findOneAndUpdate(
      { email: req.body.email },
      { password: hashedPassword },
      { new: true }
    );

    console.log(data);
    res.status(200).json({
      status: "success",
      message: "User password updated",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

//test-3 (update password current user)
// exports.updatePassword = async (req, res) => {
//   try {
//     const { newPassword, confirmPassword, oldPassword, email } = req.body;

//     // Check if the new password and confirm password match
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         message: "New password and confirm password do not match",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const isMatch = await bcrypt.compare(oldPassword, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Email and password do not match",
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     const data = await User.findOneAndUpdate(
//       { email: req.body.email },
//       { password: hashedPassword },
//       { new: true }
//     );

//     console.log(data);
//     res.status(200).json({
//       status: "success",
//       message: "User password updated",
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };

// Update user password after successful login
exports.userUpdate = async (req, res) => {
  try {
    const updateUserPass = await User.findOne({
      email: req.body.email,
    });

    if (updateUserPass) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const data = await User.findOneAndUpdate(
        { email: req.body.email },
        { password: hashedPassword },
        { new: true }
      );

      console.log(data);
      res.status(200).json({
        status: "success",
        message: "user updated",
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "undefined error",
    });
  }
};

// update password from old password
// exports.userUpdate = async (req, res, next) => {
//   try {
//     const userPass = User.findOneAndUpdate(
//       req.body.password,
//       { password: oldPassword },
//       { confirmPassword: confirmPassword },
//       { new: true }
//     );
//     console.log(userPass);
//     {
//       if (!oldPassword || !newPassword || !confirmPassword) {
//         throw new Error(
//           "Please provide old password, new password, and confirm password"
//         );
//       }

//       if (newPassword !== confirmPassword) {
//         throw new Error("New password and confirm password do not match");
//       }
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: "undefined error",
//     });
//   }
// };

//delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({
        status: "success",
        message: "user deleted",
      });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

//get All users
// exports.allUsers = async (req, res, next) => {
//   try {
//     const getAlluser = await User.find();

//     if (getAlluser) {
//       res.status(200).json({
//         status: "success",
//         getAlluser,
//       });
//     } else {
//       res.status(404).send("user not found");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

//search user by name, email and phone (different params)
// exports.search_Emp = async (req, res) => {
//   try {
//     const userQuery = req.query;
//     const { name, email, phone } = userQuery;

//     const userFilter = await User.find({
//       $or: [{ name: name }, { email: email }, { phone: phone }],
//     });

//     console.log("user1:", userQuery);
//     console.log("user2:", userFilter);
//     res.send({ data: userFilter });
//   } catch (error) {
//     res.status(500).json({
//       message: "Something went wrong",
//     });
//   }
// };

//search user by name, email and phone ()
exports.search_Emp = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const userFilter = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    });

    res.send({ data: userFilter });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
