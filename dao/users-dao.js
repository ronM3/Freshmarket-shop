const connection = require("./connection-wrapper");
let ErrorType = require("../errors/error-type");
let ServerError = require("../errors/server-error");

async function login(userLoginDetails) {
  let sql = "SELECT * FROM users where email =? and password =?";
  let parameters = [userLoginDetails.email, userLoginDetails.password];
  let usersLoginResult;

  try {
    usersLoginResult = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(
      ErrorType.GENERAL_ERROR,
      JSON.stringify(userLoginDetails),
      e
    );
  }
  if (
    usersLoginResult == null ||
    usersLoginResult.length === 0 ||
    userLoginDetails === ""
  ) {
    throw new ServerError(ErrorType.UNAUTHORIZED);
  }
  console.log("You are connected Mr " + userLoginDetails.email);
  return usersLoginResult[0];
}

async function addUser(userDetails, userType) {
  let sql =
    "INSERT INTO users(email, password, userType, firstName, lastName,city,street, id) values(?,?,?,?,?,?,?,?)";
  let parameters = [
    userDetails.email,
    userDetails.password,
    userType,
    userDetails.firstName,
    userDetails.lastName,
    userDetails.city,
    userDetails.street,
    userDetails.id,
  ];
  let userInfo;
  try {
    userInfo = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(
      ErrorType.GENERAL_ERROR,
      JSON.stringify(userDetails),
      e
    );
  }
  return userInfo;
}

async function getUserDetails(user_id) {
  let sql =
    "SELECT firstName,lastName,email,city,street FROM users where user_id=?";
  let parameters = [user_id];

  try {
    getUserDetails = await connection.executeWithParameters(sql, parameters);
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR, error);
  }
  return getUserDetails;
}

async function isUserExistByEmail(email) {
  let sql = "SELECT * FROM users where email = ?";
  let parameters = [email];

  let userEmailCheck;
  try {
    userEmailCheck = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, email, e);
  }
  return userEmailCheck[0];
}

async function isUserExistById(id) {
  let sql = "SELECT id from users where id = ?";
  let parameters = [id.id];
  let userIdCheck;
  try {
    userIdCheck = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, JSON.stringify(id), e);
  }
  if (userIdCheck[0]) {
    throw new ServerError(ErrorType.ID_ALREADY_EXIST, id);
  }
  return userIdCheck[0];
}

async function deleteUser(userID) {
  let sql = "delete from users where user_id=?";
  let parameters = [userID];
  console.log(parameters);
  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  addUser,
  deleteUser,
  login,
  isUserExistByEmail,
  isUserExistById,
  getUserDetails,
};
