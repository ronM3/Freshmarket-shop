const expressJwt = require("express-jwt");
const config = require("../config.json");
let { secret } = config;

function authenticateJwtRequestToken() {
  return expressJwt({ secret, algorithms: ["HS256"] }).unless({
    path: [
      { url: "/users/", method: "POST" },
      { url: "/users/login", method: "POST" }
    ],
  });
}

module.exports = authenticateJwtRequestToken;
