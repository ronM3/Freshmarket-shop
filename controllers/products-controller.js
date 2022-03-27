const { response } = require("express");
const express = require("express");
const router = express.Router();
const productsLogic = require("../logic/products-logic");

router.get("/", async (request, response, next) => {
  let products;
  try {
    products = await productsLogic.getAllProducts();
    response.json(products);
  } catch (error) {
    return next(error);
  }
  return products;
});

router.get("/:categoryID", async (request, response, next) => {
  let categoryID = request.params.categoryID;
  let category;

  try {
    category = await productsLogic.getByCategoryId(categoryID);
    response.json(category);
  } catch (error) {
    return next(error);
  }
  return category;
});

router.post("/", async (request, response, next) => {
  let newProduct = request.body;
  let newProductToAdd;

  try {
    newProductToAdd = await productsLogic.addProduct(newProduct);
    response.json(newProductToAdd);
  } catch (error) {
    return next(error);
  }
  return newProductToAdd;
});

router.put("/", async (request, response, next) => {
  let editedProduct = request.body;
  let productToEdit;
  console.log(editedProduct);
  try {
    productToEdit = await productsLogic.editProduct(editedProduct);
    response.json(productToEdit);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
