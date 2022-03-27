const express = require("express");
const router = express.Router();
const categoriesLogic = require("../logic/categories-logic");

router.get("/", async (request, response, next) => {
  let categories;
  try {
    categories = await categoriesLogic.getAllCategories();
    response.json(categories);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
