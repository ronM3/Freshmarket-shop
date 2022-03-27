const productDao = require("../dao/products-dao");

async function getAllProducts() {
  let getProducts = await productDao.getAllProducts();
  return getProducts;
}

async function getByCategoryId(categoryID) {
  let getCategoryProduct = await productDao.getByCategoryId(categoryID);
  return getCategoryProduct;
}

async function addProduct(newProduct) {
  let newProductToAdd = await productDao.addProduct(newProduct);
  return newProductToAdd;
}

async function editProduct(editedProduct) {
  let productToEdit = await productDao.editProduct(editedProduct);
  return productToEdit;
}

module.exports = {
  addProduct,
  editProduct,
  getAllProducts,
  getByCategoryId,
};
