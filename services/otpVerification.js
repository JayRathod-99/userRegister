const nodemailer = require("nodemailer");
const User = require("./../models/userModel");
require("dotenv").config();

// exports.sendOtp = async (req, res) => {
//   try {
//     // Generate 4 digit random OTP
//     const otp = Math.floor(1000 + Math.random() * 9000);

//     // Find user by email and update the OTP
//     const user = await User.findOneAndUpdate(
//       { email: req.body.email },
//       { otp: otp },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(404).json({
//         status: "fail",
//         message: "User not found",
//       });
//     }

//     // Create transport object for sending email
//     const transport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USERNAME, // Your email username
//         pass: process.env.EMAIL_PASSWORD, // Your email password
//       },
//     });

//     // Define email options
//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME, // Sender email address
//       to: req.body.email, // Recipient email address
//       subject: "OTP Verification", // Email subject
//       html: `<p>Your OTP is ${otp}. Please enter this code to verify your account.</p>`, // Email body
//     };

//     // Send email
//     await transport.sendMail(mailOptions);

//     res.status(200).json({
//       // status: "success",
//       message: "OTP sent successfully",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
//     });
//   }
// };

exports.sendOtp = async (req, res) => {
  const email = req.body.email;

  // Generate a 4-digit OTP
  const OTP = Math.floor(1000 + Math.random() * 9000);
  console.log("send otp:1", OTP);

  // Store the OTP in the database
  const user = await User.findOneAndUpdate({ email: email }, { otp: OTP });

  if (!user) {
    // User does not exist, create a new user with the generated OTP
    const newUser = new User({
      email: email,
      otp: OTP,
    });

    await newUser.save();
  }

  // Send the OTP to the user's email address
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Your OTP for authentication",
    text: `Your OTP is ${OTP}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to send OTP" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "OTP sent successfully" });
    }
  });
};

exports.verifyOTP = async (req, res) => {
  // const email = req.body.email;
  // const otp = req.body.otp;
  // console.log("step:1", otp);

  // const user = await User.findOne({ email: req.body.email });

  // let user = await User.findOneAndUpdate(
  //   {
  //     email: req.body.email,
  //     otp: req.body.otp,
  //   },
  //   { otp: 0 }
  // );
  // console.log("step:2", user);
  // user.otp = null;
  // // await user.save();
  // if (user) {
  //   res.status(200).json({
  //     status: "success",
  //     message: "OTP verification successful!",
  //   });
  // } else if (user.otp !== otp) {
  //   return res.status(401).json({
  //     error: "Invalid OTP",
  //     message: "The OTP you provide is not valid.",
  //   });
  // } else {
  //   res.status(401).json({
  //     error: "Invalid OTP",
  //   });
  // }

  // code round:2
  const email = req.body.email;
  const otp = req.body.otp;
  console.log("step:1", otp);

  const user = await User.findOne({ email: email });

  if (user) {
    const userdata = await User.findOneAndUpdate(
      { email: email, otp: otp },
      { otp: 0 }
    );
    if (userdata) {
      res.status(200).json({
        status: "success",
        message: "OTP verification successful!",
      });
    } else {
      res.status(401).json({
        error: "Invalid OTP",
      });
    }
  } else {
    res.status(404).json({
      error: "User with this email not found",
    });
  }

  // if (!user) {
  //   res.status(404).json({
  //     error: "User with this email not found",
  //   });
  //   return;
  // }

  // console.log("step:2", user);

  // if (user.otp !== otp) {
  //   console.log("inside the loop:", user.otp);
  //   res.status(401).json({
  //     error: "Invalid OTP",
  //   });
  //   return;
  // } else {
  //   // OTP verification successful
  //   res.status(200).json({
  //     status: "success",
  //     message: "OTP verification successful!",
  //   });
  // }
};
