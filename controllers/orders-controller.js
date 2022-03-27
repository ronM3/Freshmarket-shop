const express = require("express");
const router = express.Router();
const ordersLogic = require("../logic/orders-logic");
const jwt_decode = require("jwt-decode");

router.post("/", async (request, response, next) => {
  let newOrder = request.body;
  let token = request.headers.authorization;
  let decoded = jwt_decode(token);
  let userID = decoded.userID;
  let newOrderAdding;
  try {
    newOrderAdding = await ordersLogic.addNewOrder(newOrder, userID);
    response.json(newOrderAdding);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
