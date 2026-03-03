const http = require('http');
const https = require('https');
const { URL } = require('url');
const { getTeas, getOrders, createOrder } = require('./db');

const port = process.env.PORT || 3000;
const wechatAppId = process.env.WECHAT_APP_ID || '';
const wechatAppSecret = process.env.WECHAT_APP_SECRET || '';

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

function fetchCode2Session(code) {
  return new Promise((resolve, reject) => {
    const requestUrl = new URL('https://api.weixin.qq.com/sns/jscode2session');
    requestUrl.searchParams.set('appid', wechatAppId);
    requestUrl.searchParams.set('secret', wechatAppSecret);
    requestUrl.searchParams.set('js_code', code);
    requestUrl.searchParams.set('grant_type', 'authorization_code');

    https
      .get(requestUrl, (resp) => {
        let body = '';
        resp.on('data', (chunk) => {
          body += chunk;
        });
        resp.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error('微信接口返回非 JSON 数据'));
          }
        });
      })
      .on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://localhost:${port}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true, wechatConfigured: Boolean(wechatAppId && wechatAppSecret) });
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

  if (req.method === 'POST' && url.pathname === '/api/wechat/code2session') {
    try {
      const { code } = await parseBody(req);
      if (!code) {
        sendJson(res, 400, { message: '缺少 code' });
        return;
      }
      if (!wechatAppId || !wechatAppSecret) {
        sendJson(res, 500, { message: '服务端未配置 WECHAT_APP_ID / WECHAT_APP_SECRET' });
        return;
      }

      const result = await fetchCode2Session(code);
      if (result.errcode) {
        sendJson(res, 400, { message: result.errmsg || '微信登录失败', errcode: result.errcode });
        return;
      }

      sendJson(res, 200, {
        data: {
          openid: result.openid,
          session_key: result.session_key,
          unionid: result.unionid || null
        }
      });
      return;
    } catch (error) {
      sendJson(res, 500, { message: '微信登录请求失败' });
      return;
    }
  }

  sendJson(res, 404, { message: 'Not Found' });
});

server.listen(port, () => {
  console.log(`Milk tea backend is running at http://localhost:${port}`);
});
