const express = require("express");
const router = express.Router();
const cartsLogic = require("../logic/carts-logic");
const jwt_decode = require("jwt-decode");

router.post("/add", async (request, response, next) => {
  let productToAdd = request.body;
  let productAdding;
  try {
    productAdding = await cartsLogic.addProductToCart(productToAdd);
    response.json(productAdding);
  } catch (error) {
    return next(error);
  }
});

router.put("/", async (request, response, next) => {
  let productToUpdate = request.body;
  let token = request.headers.authorization;
  let decoded = jwt_decode(token);
  let userID = decoded.userID;
  let updateAddedProduct;

  try {
    updateAddedProduct = await cartsLogic.updateProduct(
      productToUpdate,
      userID
    );
    response.json(updateAddedProduct);
  } catch (error) {
    return next(error);
  }
});

router.post("/new", async (request, response, next) => {
  let newCartAdding = request.body;
  try {
    newCartAdding = await cartsLogic.creatNewCart(newCartAdding);
    response.json(newCartAdding);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:productID", async (request, response, next) => {
  let productID = request.params.productID;
  let token = request.headers.authorization;
  let decoded = jwt_decode(token);
  let userID = decoded.userID;
  let deleteItem;
  try {
    deleteItem = await cartsLogic.deleteItem(productID, userID);
    response.json(deleteItem);
  } catch (error) {
    return next(error);
  }
  return deleteItem;
});

router.delete("/empty/:cart_id", async (request, response, next) => {
  let cart_id = request.params.cart_id;
  try {
    deleteAllItems = await cartsLogic.deleteAllItems(cart_id);
    response.json(deleteAllItems);
  } catch (error) {
    return next(error);
  }
});

router.get("/user", async (request, response, next) => {
  let token = request.headers.authorization;
  let decoded = jwt_decode(token);
  let user_id = decoded.userID;
  let userCart;
  try {
    userCart = await cartsLogic.getUserCart(user_id);
    response.json(userCart);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
