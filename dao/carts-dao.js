const connection = require("./connection-wrapper");
let ErrorType = require("../errors/error-type");
let ServerError = require("../errors/server-error");

async function addProductToCart(productToAdd) {
  let sql =
    "INSERT INTO carts_items(productID, amount, sum_price, cart_id) values(?,?,?,?)";
  let parameters = [
    productToAdd.productID,
    productToAdd.amount,
    productToAdd.sum_price,
    productToAdd.cart_id,
  ];
  let productAddingToCart;
  try {
    productAddingToCart = await connection.executeWithParameters(
      sql,
      parameters
    );
  } catch (e) {
    throw new ServerError(
      ErrorType.GENERAL_ERROR,
      JSON.stringify(productToAdd),
      e
    );
  }
  return productAddingToCart;
}

async function updateProduct(productToUpdate, cart_id) {
  let sql =
    "UPDATE carts_items SET amount = ?, sum_price = ? where productID = ? and cart_id = ?";
  let parameters = [
    productToUpdate.amount,
    productToUpdate.sum_price,
    productToUpdate.productID,
    cart_id,
  ];
  await connection.executeWithParameters(sql, parameters);
}

async function deleteItem(productID, cart_id) {
  let sql = "DELETE FROM carts_items where cart_id = ? and productID = ?";
  parameters = [cart_id, productID];
  await connection.executeWithParameters(sql, parameters);
}

async function creatNewCart(newCartAdding) {
  let sql = "INSERT INTO carts(user_id, date_created) values(?,now())";
  let parameters = [newCartAdding.user_id];
  try {
    newCartAdding = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, newCartAdding, e);
  }
  return newCartAdding;
}

async function getUserCart(user_id) {
  let sql = `SELECT c.cart_id, c.date_created, ci.productID, ci.amount, ci.sum_price, p.product_name, p.categoryID, p.product_price, p.image, p.info
  from carts c left join carts_items ci on c.cart_id = ci.cart_id
  left join products p on ci.productID = p.productID
  where c.user_id = ?`;
  let parameters = [user_id];
  let userCartItems = await connection.executeWithParameters(sql, parameters);
  return userCartItems;
}

async function deleteAllItems(cart_id) {
  let sql = "DELETE FROM carts_items where cart_id = ?";
  let parameters = [cart_id];
  await connection.executeWithParameters(sql, parameters);
}

async function isCartExistById(userID) {
  let sql = "SELECT * FROM carts where user_id = ?";
  let parameters = [userID];
  let cartCheck;
  try {
    cartCheck = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, userID, e);
  }
  let cartID;
  cartCheck.forEach((cart) => {
    cartID = cart.cart_id;
  });
  return cartCheck[0], cartID;
}

module.exports = {
  addProductToCart,
  isCartExistById,
  creatNewCart,
  deleteItem,
  getUserCart,
  updateProduct,
  deleteAllItems,
};
