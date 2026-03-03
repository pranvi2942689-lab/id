const http = require('http');
const { URL } = require('url');
const { getTeas, getOrders, createOrder } = require('./db');

const port = process.env.PORT || 3000;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://localhost:${port}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/teas') {
    sendJson(res, 200, { data: getTeas() });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/orders') {
    sendJson(res, 200, { data: getOrders() });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/orders') {
    try {
      const { customerName, pickupTime, items } = await parseBody(req);

      if (!customerName || !pickupTime || !Array.isArray(items) || items.length === 0) {
        sendJson(res, 400, { message: '参数不完整，请提供 customerName、pickupTime 和 items' });
        return;
      }

      const normalizedItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1
      }));

      const order = createOrder({ customerName, pickupTime, items: normalizedItems });
      sendJson(res, 201, { data: order });
      return;
    } catch (error) {
      sendJson(res, 400, { message: '请求体 JSON 格式错误' });
      return;
    }
  }

  sendJson(res, 404, { message: 'Not Found' });
});

server.listen(port, () => {
  console.log(`Milk tea backend is running at http://localhost:${port}`);
});
