const expressJwt = require("express-jwt");
const config = require("../config.json");
let { secret } = config;

function authenticateJwtRequestToken() {
  return expressJwt({ secret, algorithms: ["HS256"] }).unless({
    path: [
      // public routes that don't require authentication

      "/users/login",
      "/users/Register",
    ],
  });
}

module.exports = authenticateJwtRequestToken;
