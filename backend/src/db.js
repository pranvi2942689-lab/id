const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'data.json');

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getTeas() {
  return readData().teas;
}

function getOrders() {
  return readData().orders;
}

function createOrder(orderInput) {
  const data = readData();
  const newOrder = {
    id: `od-${Date.now()}`,
    customerName: orderInput.customerName,
    pickupTime: orderInput.pickupTime,
    items: orderInput.items,
    totalPrice: orderInput.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: '待制作',
    createdAt: new Date().toISOString()
  };

  data.orders.unshift(newOrder);
  writeData(data);
  return newOrder;
}

module.exports = {
  getTeas,
  getOrders,
  createOrder
};
