let ErrorType = {
  GENERAL_ERROR: {
    id: 1,
    httpCode: 600,
    message:
      "Oops we are sorry, looks like there is a network error. We are doing our best and working on it so come back soon!",
    isShowStackTrace: true,
  },
  EMAIL_ALREADY_EXIST: {
    id: 2,
    httpCode: 601,
    message: "email already exist in the system",
    isShowStackTrace: false,
  },
  UNAUTHORIZED: {
    id: 3,
    httpCode: 401,
    message: "Login failed, invalid user name or password",
    isShowStackTrace: false,
  },
  ID_ALREADY_EXIST: {
    id: 4,
    httpCode: 601,
    message: "Your id number is already exist in the system.",
    isShowStackTrace: false,
  },
};

module.exports = ErrorType;
