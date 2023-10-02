const express = require("express");
const multer = require("multer");
const router = express.Router();
const companyController = require("./../controllers/companyController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    // @ts-ignore
    filesize: 1024 * 1024 * 3,
  },
});

router.post(
  "/companyImgUpload",
  upload.single("companyImage"),
  companyController.addCompanyImage
);

router.post("/addEmpData", companyController.addEmployee);
// router.post("/addCompanyData", companyController.addCompany);//create new compnay simple
router.post("/createCompanyData", companyController.addCompany); //create data with date
// router.get("/getEmpData", companyController.getEmpData);
// router.get("/getEmpData/:id", companyController.getEmpData);
router.get("/getAlldata", companyController.getalldata);
// router.post("/addCompanyData", companyController.addCompanyDetails);
router.get("/searchEmp", companyController.search_Emp); // search employee(only one)

module.exports = router;
