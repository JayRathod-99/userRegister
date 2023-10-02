const express = require("express");
const multer = require("multer");
const router = express.Router();

const userController = require("./../controllers/userController");
const otpVarification = require("./../services/otpVerification");

//image upload api when user registration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

//user register api route
router.post("/signup", upload.single("profileImage"), userController.signup);

//user login otp route
router.post("/send-otp", otpVarification.sendOtp);
router.post("/verifyotp", otpVarification.verifyOTP);

router.post("/login", userController.login);
router.put("/update", userController.userUpdate);
router.put("/reset-password", userController.userUpdate);
router.delete("/delete/:id", userController.deleteUser);
// router.get("/allUsers", userController.allUsers);

router.patch("/updatePassword", userController.updatePassword);
router.get("/search_Emp", userController.search_Emp);

module.exports = router;
