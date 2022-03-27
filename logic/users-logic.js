const usersDao = require("../dao/users-dao");
const crypto = require("crypto");
const config = require("../config.json");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

const jwt = require("jsonwebtoken");
const saltRight = "sdkjfhdskajh";
const saltLeft = "--mnlcfs;@!$ ";

async function login(userLoginDetails) {
  if (userLoginDetails.email === "" || userLoginDetails.password === "") {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
  userLoginDetails.password = crypto
    .createHash("md5")
    .update(saltLeft + userLoginDetails.password + saltRight)
    .digest("hex");

  userLoginDetails = await usersDao.login(userLoginDetails);

  const token = jwt.sign(
    {
      userID: userLoginDetails.user_id,
      userType: userLoginDetails.userType,
    },
    config.secret
  );
  return {
    token: token,
    userID: userLoginDetails.user_id,
    userType: userLoginDetails.userType,
  };
}

async function addUser(userDetails, userType) {
  if (await usersDao.isUserExistByEmail(userDetails.email)) {
    throw new ServerError(ErrorType.USER_NAME_ALREADY_EXIST);
  }
  userDetails.password = crypto
    .createHash("md5")
    .update(saltLeft + userDetails.password + saltRight)
    .digest("hex");
  let userAdding;
  userAdding = await usersDao.addUser(userDetails, userType);
  return userAdding;
}

async function getUserDetails(user_id) {
  getUserDetails = await usersDao.getUserDetails(user_id);
  return getUserDetails;
}

async function isUserExistById(id) {
  let isUserExist = await usersDao.isUserExistById(id);
  return isUserExist;
}

async function deleteUser(userID) {
  let userDelete = await usersDao.deleteUser(userID);
  return userDelete;
}

module.exports = {
  addUser,
  deleteUser,
  login,
  isUserExistById,
  getUserDetails,
};
