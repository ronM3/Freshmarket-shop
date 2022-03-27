const connection = require("./connection-wrapper");

async function getAllProducts() {
  let sql = "SELECT * from products";
  let products = await connection.execute(sql);
  let sql2 = "select count(productID) as AmountOfProducts from products"
  AmountOfProducts = await connection.execute(sql2)
  return products;
}

async function getByCategoryId(categoryID) {
  let sql = "SELECT * FROM products where categoryID = ?";
  let paramaters = [categoryID];
  let categoryProducts = await connection.executeWithParameters(
    sql,
    paramaters
  );
  return categoryProducts;
}

async function addProduct(newProduct) {
  let sql =
    "INSERT INTO products (product_name, categoryID, product_price, image,info) values(?,?,?,?,?)";
  let paramaters = [
    newProduct.product_name,
    newProduct.categoryID,
    newProduct.product_price,
    newProduct.image,
    newProduct.info,
  ];
  let newProductToAdd;
  try {
    newProductToAdd = await connection.executeWithParameters(sql, paramaters);
  } catch (error) {
    throw new Error(JSON.stringify(newProductToAdd), error);
  }
}

async function editProduct(editedProduct) {
  let sql =
    "UPDATE products SET product_name = ?, categoryID = ?, product_price = ?, image = ?, info = ? where productID = ?";

  let paramaters = [
    editedProduct.product_name,
    editedProduct.categoryID,
    editedProduct.product_price,
    editedProduct.image,
    editedProduct.info,
    editedProduct.productID
  ];
  let editProduct = await connection.executeWithParameters(sql, paramaters);
  return editProduct;
}

module.exports = {
  addProduct,
  editProduct,
  getAllProducts,
  getByCategoryId,
};
