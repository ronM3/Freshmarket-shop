const connection = require("./connection-wrapper");

async function addNewOrder(newOrder, userID) {
  let sql =
    "INSERT INTO orders (user_id, cart_id, order_total, city, street, shipping_date, order_date, credit_card) values(?,?,?,?,?,?,now(),?)";

  let parameters = [
    userID,
    newOrder.cart_id,
    newOrder.order_total,
    newOrder.city,
    newOrder.street,
    newOrder.shipping_date,
    newOrder.credit_card,
  ];
  let addOrder = await connection.executeWithParameters(sql, parameters);
  return addOrder;
}

module.exports = {
  addNewOrder,
};
