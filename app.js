const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

const users = require("./routes/userRoutes");
const product = require("./routes/productRoutes");
const crud = require("./routes/crudRoutes");
const company = require("./routes/companyRoute");
const AppError = require("./utils/appError");

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connected successfully...💹");
  });

  console.log("aaaaa")

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/profileImage", express.static("./uploads/"));
app.use("/companyImage", express.static("./uploads/"));
app.use("/api/v1/users", users);
app.use("/api/product", product);
app.use("/api/crud", crud);
app.use("/api/company", company);

//image upload api
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// let upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 3,
//   },
// });

app.use("/image-upload", express.static("./uploads"));

// middleware for upload imagefile
// app.post("/image-upload", upload.single("image"), (req, res) => {
//   res.json({
//     status: "success",
//     profile_url: `http://localhost:4000/image-upload/${req.file.filename}`,
//   });
// });

function apiResponse(result) {
  console.log(result);
  return JSON.stringify({ status: "success", response: result });
}

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.listen(PORT, () => {
  console.log("server is running up to date...");
});
