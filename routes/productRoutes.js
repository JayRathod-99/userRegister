const express = require("express");
const router = express.Router();

const userController = require("./../controllers/userController");
const productController = require("./../controllers/productController");
const otpVarification = require("./../services/otpVerification");

router.post("/addProduct", productController.addProduct);
router.post("/addProductwithEmp", productController.addProductwithEmp);
router.put("/updateProdects", productController.updateProducts);
router.put("/products", productController.editUserProduct);

router.post("/createProduct", productController.createProduct);
// router.post("/updateProduct", productController.updateProduct); //update through email
// router.post("/updateProduct/:id", productController.updateProduct); //update through id
// router.put("/updatePrdDetails", productController.updatePrdDetails); //update through id & email

router.delete("/deleteProduct/:id", productController.deleteProduct); //delete product through uesrObject id
router.put("/updatePrdDetails", productController.updateProducts); //update product through uesrObject id
// router.get("/getAllProducts", productController.getAllProducts);
// router.get("/getAllData", productController.getAllData);
router.get("/getHighestProductData", productController.getHighestProductData); //get all products with highest price
router.get("/getAllProductData", productController.getAllProductData); //get all products with highest price
router.get("/getUserEmail", productController.getUserEmail); //get user email using employee objId
router.get("/getUserEmailByEmployeeId", productController.getUserEmail); //get user email using employee objId

module.exports = router;
