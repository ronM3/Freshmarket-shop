const ordersDao = require("../dao/orders-dao");

async function addNewOrder(newOrder, userID) {
  await ordersDao.addNewOrder(newOrder, userID);
}

module.exports = {
  addNewOrder,
};
