const Crud = require("../models/crudModel");
const responseError = require("../utils/middleware");

exports.addProduct = async (req, res) => {
  const { email, product_name, product_price, product_details } = req.body;

  const data = new Crud({
    email: req.body.email,
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_details: req.body.product_details,
  });

  const addProduct = await data.save();
  if (addProduct) {
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: addProduct,
    });
  } else {
    res.status(404).json({
      status: "fail",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const editProduct = await Crud.findOne({ email: req.body.email });

  if (!editProduct) {
    res.send({
      status: "error",
      message: "This email was not exists",
    });
  } else {
    const editProduct = await Crud.findOneAndUpdate(req.body.email, {
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      product_details: req.body.product_details,
    });
    res.send({
      status: "success",
      message: "Product updated successfully.",
      editProduct,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const deleteProduct = await Crud.findOneAndDelete(req.body.email);

  if (deleteProduct) {
    res.send({
      status: "success",
      message: "product deleted successfully",
    });
  } else {
    res.send({
      status: "failed",
      message: "email not found",
    });
  }
};

//update data using id and email
exports.updatePrdDetails = async (req, res) => {
  try {
    const email = req.body.email;
    const id = req.body.id;

    if (email) {
      const dEmail = await Crud.findOne({ email: email });

      if (dEmail) {
        const updateProduct = await Crud.findOneAndUpdate(
          { email: email },
          {
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            product_details: req.body.product_details,
          },
          { new: true }
        );
        if (updateProduct) {
          res.status(200).json({
            status: "success",
            message: "user updated successfully.",
            updateProduct,
          });
        } else {
          res.status(500).json({
            status: "fail",
            message: "user not updated.",
          });
        }
      } else {
        res.status(500).json({
          status: "fail",
          message: "email was wrong.",
        });
      }
    } else {
      if (id) {
        const pid = await Crud.findById(id);
        if (pid) {
          const updateProduct = await Crud.findByIdAndUpdate(
            { _id: req.body.id },
            {
              product_name: req.body.product_name,
              product_price: req.body.product_price,
              product_details: req.body.product_details,
            },
            { new: true }
          );
          if (updateProduct) {
            res.status(200).json({
              status: "success",
              message: "id updated successfully.",
              updateProduct,
            });
          }
        } else {
          res.status(500).json({
            status: "fail",
            message: "id was wrong.",
          });
        }
      } else {
        res.status(500).json({
          status: "fail",
          message: "email and id was wrong",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Server error",
    });
  }
};
