const BASE_URL = 'http://127.0.0.1:3000';

function request(url, method = 'GET', data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
          return;
        }
        reject(res.data || { message: '请求失败' });
      },
      fail: reject
    });
  });
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
  }
};
