const { response } = require("express");
const express = require("express");
const router = express.Router();
const usersLogic = require("../logic/users-logic");
const jwt_decode = require("jwt-decode");

router.post("/login", async (request, response, next) => {
  let userLoginDetails = request.body;
  let userLogin;
  try {
    userLogin = await usersLogic.login(userLoginDetails);
    response.json(userLogin);
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (request, response, next) => {
  let token = request.headers.authorization;
  let decoded = jwt_decode(token);
  let user_id = decoded.userID;
  try {
    getUserDetails = await usersLogic.getUserDetails(user_id);
    response.json(getUserDetails);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (request, response, next) => {
  let userDetails = request.body;
  let userType = "customer";
  let userInfo;
  try {
    userInfo = await usersLogic.addUser(userDetails, userType);
    response.json(userInfo);
  } catch (error) {
    return next(error);
  }
});

router.post("/idCheck", async (request, response, next) => {
  let id = request.body;
  try {
    let isIdExist = await usersLogic.isUserExistById(id);
    response.json(isIdExist);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:userID", async (request, response, next) => {
  let userID = request.params.body;
  let deleteUser;
  try {
    deleteUser = await usersLogic.deleteUser(userID);
    response.json();
  } catch (error) {
    return next(error);
  }
  return deleteUser;
});

module.exports = router;
