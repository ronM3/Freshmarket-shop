const cartsDao = require("../dao/carts-dao");

async function addProductToCart(productToAdd) {
  let addProductToCart;
  addProductToCart = await cartsDao.addProductToCart(productToAdd);
  return addProductToCart;
}

async function updateProduct(productToUpdate, userID) {
  let cart_id = await cartsDao.isCartExistById(userID);
  await cartsDao.updateProduct(productToUpdate, cart_id);
}

async function deleteItem(productID, userID) {
  let cart_id = await cartsDao.isCartExistById(userID);
  await cartsDao.deleteItem(productID, cart_id);
}

async function deleteAllItems(cart_id) {
  await cartsDao.deleteAllItems(cart_id);
}

async function creatNewCart(newCartAdding) {
  let isCartExist = await cartsDao.isCartExistById(newCartAdding.user_id);
  if (isCartExist > 0) {
    return;
  }
  newCartAdding = await cartsDao.creatNewCart(newCartAdding);
  return newCartAdding;
}

async function getUserCart(user_id) {
  let cartById = await cartsDao.getUserCart(user_id);
  return cartById;
}

module.exports = {
  addProductToCart,
  getUserCart,
  deleteItem,
  updateProduct,
  deleteAllItems,
  creatNewCart,
};
