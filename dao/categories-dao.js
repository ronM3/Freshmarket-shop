const connection = require("./connection-wrapper");
let ErrorType = require("../errors/error-type");
let ServerError = require("../errors/server-error");

async function getAllCategories() {
  let sql = "SELECT * FROM categories";
  let categories = await connection.execute(sql);
  return categories;
}

module.exports = {
  getAllCategories,
};
