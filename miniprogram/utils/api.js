const config = require('../config');

const BASE_URLS = Array.isArray(config.apiBaseUrls) ? config.apiBaseUrls : [];

function requestWithBase(baseUrl, url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      method,
      data,
      timeout: 8000,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
          return;
        }
        reject({
          type: 'http',
          baseUrl,
          statusCode: res.statusCode,
          payload: res.data
        });
      },
      fail: (error) => {
        reject({
          type: 'network',
          baseUrl,
          error
        });
      }
    });
  });
}

async function request(url, method = 'GET', data) {
  if (!BASE_URLS.length) {
    throw new Error('未配置 apiBaseUrls');
  }

  let lastError;
  for (const baseUrl of BASE_URLS) {
    try {
      const response = await requestWithBase(baseUrl, url, method, data);
      return {
        ...response,
        __meta: { baseUrl }
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function parseFriendlyError(error) {
  if (!error) {
    return '未知错误';
  }

  if (error.type === 'http') {
    const msg = error.payload && error.payload.message ? error.payload.message : '服务异常';
    return `${error.statusCode} ${msg}`;
  }

  if (error.type === 'network') {
    const reason = error.error && error.error.errMsg ? error.error.errMsg : '网络连接失败';
    return `${reason} (${error.baseUrl})`;
  }

  if (error.message) {
    return error.message;
  }

  return '请求失败';
}

module.exports = {
  getMenu() {
    return request('/api/teas');
  },
  createOrder(payload) {
    return request('/api/orders', 'POST', payload);
  },
  getOrders() {
    return request('/api/orders');
  },
  code2Session(code) {
    return request('/api/wechat/code2session', 'POST', { code });
  },
  parseFriendlyError
};
