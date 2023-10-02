const express = require("express");
const router = express.Router();

const crudController = require("./../controllers/crudControllr");

router.post("/addProduct", crudController.addProduct);

router.put("/editProduct", crudController.updateProduct);

router.delete("/deleteProduct", crudController.deleteProduct);

router.put("/updatePrdDetails", crudController.updatePrdDetails); //updat with email and id

module.exports = router;
